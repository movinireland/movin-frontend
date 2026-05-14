// js/api.js — All calls to the Movin.ie backend API

function getApiUrl() { return window.MOVIN_API_URL || 'http://localhost:3001' }

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('movin_token')
}

function setToken(token) {
  localStorage.setItem('movin_token', token)
}

function clearToken() {
  localStorage.removeItem('movin_token')
  localStorage.removeItem('movin_user')
}

function setUser(user) {
  localStorage.setItem('movin_user', JSON.stringify(user))
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('movin_user')) } catch { return null }
}

async function request(method, path, body = null, isFormData = false) {
  const headers = {}
  const token = getToken()

  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData && body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${getApiUrl()}${path}`, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
  })

  // Token expired
  if (res.status === 401) {
    clearToken()
    window.location.href = '/pages/login.html'
    return
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.')
  }

  return data
}

// ── Auth ──────────────────────────────────────────────────────────────────────

const auth = {
  async register(name, email, password, phone) {
    const data = await request('POST', '/api/auth/register', { name, email, password, phone })
    setToken(data.token)
    setUser(data.user)
    return data
  },

  async login(email, password) {
    const data = await request('POST', '/api/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    return data
  },

  async me() {
    const data = await request('GET', '/api/auth/me')
    setUser(data)
    return data
  },

  async updateProfile(fields) {
    const data = await request('PUT', '/api/auth/me', fields)
    setUser(data)
    return data
  },

  logout() {
    clearToken()
    window.location.href = '/'
  },

  isLoggedIn() {
    return !!getToken()
  },

  currentUser() {
    return getUser()
  }
}

// ── Listings ──────────────────────────────────────────────────────────────────

const listings = {
  async search(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return request('GET', `/api/listings?${qs}`)
  },

  async get(id) {
    return request('GET', `/api/listings/${id}`)
  },

  async mine() {
    return request('GET', '/api/listings/mine')
  },

  async create(data) {
    return request('POST', '/api/listings', data)
  },

  async update(id, data) {
    return request('PUT', `/api/listings/${id}`, data)
  },

  async delete(id) {
    return request('DELETE', `/api/listings/${id}`)
  },

  async trackView(id) {
    return request('POST', `/api/listings/${id}/view`).catch(() => {})
  },

  /*
   * Notify Movin admins (dev@movin.ie) that a new listing needs approval.
   * Tries the backend's admin-notify endpoint first; falls back to a generic
   * notification endpoint so the call still has a chance of succeeding even
   * if the backend evolves. Failure is silent — never block the user flow.
   *
   * Backend should email dev@movin.ie with the listing summary + a deep link
   * to the admin moderation page.
   */
  async notifyAdminOfNewListing(listingId, summary = {}) {
    const payload = {
      listing_id: listingId,
      summary,
      admin_email: 'dev@movin.ie',
      reason: 'new_listing_pending_approval',
      submitted_at: new Date().toISOString()
    }
    const tries = [
      ['POST', `/api/listings/${listingId}/notify-admin`],
      ['POST', '/api/admin/notifications'],
      ['POST', '/api/notify']
    ]
    for (const [method, path] of tries) {
      try { return await request(method, path, payload) }
      catch (e) { /* try next */ }
    }
    return null
  }
}

// ── Photos ────────────────────────────────────────────────────────────────────

const photos = {
  async upload(listingId, files) {
    const formData = new FormData()
    Array.from(files).forEach(f => formData.append('photos', f))
    return request('POST', `/api/listings/${listingId}/photos`, formData, true)
  },

  async delete(listingId, photoId) {
    return request('DELETE', `/api/listings/${listingId}/photos/${photoId}`)
  },

  async setPrimary(listingId, photoId) {
    return request('PUT', `/api/listings/${listingId}/photos/${photoId}/primary`)
  }
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

const enquiries = {
  async send(listingId, data) {
    return request('POST', `/api/listings/${listingId}/enquire`, data)
  },

  async inbox() {
    return request('GET', '/api/enquiries/inbox')
  },

  async sent() {
    return request('GET', '/api/enquiries/sent')
  },

  async markRead(id) {
    return request('PUT', `/api/enquiries/${id}/read`)
  }
}

// ── Payments ──────────────────────────────────────────────────────────────────

const payments = {
  async startCheckout(listingId) {
    return request('POST', `/api/payments/checkout/${listingId}`)
  },

  async confirmSuccess(listingId) {
    return request('GET', `/api/payments/success?listing=${listingId}`)
  }
}

// ── Saved listings ────────────────────────────────────────────────────────────

const saved = {
  async all() {
    return request('GET', '/api/saved')
  },

  async save(listingId) {
    return request('POST', `/api/saved/${listingId}`)
  },

  async unsave(listingId) {
    return request('DELETE', `/api/saved/${listingId}`)
  }
}

// ── Push notifications ───────────────────────────────────────────────────────

const push = {
  async getVapidKey() {
    return request('GET', '/api/push/vapid-key')
  },

  async subscribe(subscription) {
    return request('POST', '/api/push/subscribe', { subscription })
  },

  async unsubscribe(endpoint) {
    return request('POST', '/api/push/unsubscribe', { endpoint })
  }
}

// ── Post-auth destination ─────────────────────────────────────────────────────
// Use after register/login/verify to send the user to the right home page.
// Agents get the agent dashboard; everyone else gets the regular dashboard.
function postAuthDest(user, fallback) {
  var u = user || getUser() || {}
  if (u.role === 'agent') return '/pages/agent-dashboard.html'
  return fallback || '/pages/dashboard.html'
}

// ── Export ────────────────────────────────────────────────────────────────────

window.API = { auth, listings, photos, enquiries, payments, saved, push, getUser, getToken, postAuthDest }
