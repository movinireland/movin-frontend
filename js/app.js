// js/app.js — Shared utilities, nav, toast notifications

// ── Config ────────────────────────────────────────────────────────────────────
window.MOVIN_API_URL = 'https://movin-backend-production-1fb3.up.railway.app' // Change to your Railway URL for production

// ── Toast notifications ───────────────────────────────────────────────────────
function toast(message, type = 'success', duration = 3500) {
  const existing = document.querySelector('.toast-container')
  const container = existing || (() => {
    const c = document.createElement('div')
    c.className = 'toast-container'
    c.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:8px'
    document.body.appendChild(c)
    return c
  })()

  const t = document.createElement('div')
  t.style.cssText = `
    background:${type === 'error' ? '#b91c1c' : type === 'info' ? '#1d4ed8' : '#1a5c45'};
    color:#fff; padding:.85rem 1.25rem; border-radius:12px;
    font-size:14px; font-family:'DM Sans',sans-serif; font-weight:400;
    box-shadow:0 4px 20px rgba(0,0,0,.2); max-width:320px;
    animation: slideIn .25s ease; cursor:pointer;
  `
  t.textContent = message
  t.onclick = () => t.remove()

  const style = document.createElement('style')
  style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}'
  if (!document.querySelector('#toast-style')) { style.id = 'toast-style'; document.head.appendChild(style) }

  container.appendChild(t)
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300) }, duration)
}

// ── Format price ──────────────────────────────────────────────────────────────
function formatPrice(price, type) {
  const p = '€' + Number(price).toLocaleString('en-IE')
  return type === 'rent' ? `${p}/mo` : p
}

// ── Format date ───────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)   return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days < 30)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IE', { day:'numeric', month:'short', year:'numeric' })
}

// ── Redirect if not logged in ─────────────────────────────────────────────────
function requireLogin() {
  if (!window.API.auth.isLoggedIn()) {
    window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname)
    return false
  }
  return true
}

// ── Inject nav ────────────────────────────────────────────────────────────────
// REPLACE the renderNav function in your js/app.js with this entire function
 
function renderNav(activePage = '') {
  const user = window.API ? window.API.getUser() : null
  const isLoggedIn = window.API ? window.API.auth.isLoggedIn() : false
  const root = window.location.pathname.includes('/pages/') ? '../' : './'
 
  const nav = document.getElementById('main-nav')
  if (!nav) return
 
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="${root}index.html" class="nav-logo">mov<span>in</span></a>
 
      <ul class="nav-links">
        <li class="${activePage === 'buy' ? 'active' : ''}"
            onclick="window.location.href='${root}pages/search.html?listing_type=sale'">Buy</li>
 
        <li class="${activePage === 'rent' ? 'active' : ''}"
            onclick="window.location.href='${root}pages/search.html?listing_type=rent'">Rent</li>
 
        <li class="${activePage === 'list' ? 'active' : ''}"
            onclick="window.location.href='${root}pages/list.html'">List your property</li>
 
        <li onclick="window.location.href='${root}pages/search.html?new_dev=1'">New homes</li>
 
        <!-- Tools dropdown -->
        <li class="nav-has-dropdown ${activePage === 'tools' ? 'active' : ''}"
            id="tools-nav-item"
            onclick="toggleToolsDropdown(event)">
          Tools ▾
          <div class="nav-tools-dropdown" id="tools-dropdown">
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#mortgage'">
              <span class="ntd-icon">🏦</span>
              <div>
                <div class="ntd-title">Mortgage calculator</div>
                <div class="ntd-sub">Monthly repayments & affordability</div>
              </div>
            </div>
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#valuation'">
              <span class="ntd-icon">🏡</span>
              <div>
                <div class="ntd-title">Home valuation</div>
                <div class="ntd-sub">Instant estimate based on Irish data</div>
              </div>
            </div>
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#stamp'">
              <span class="ntd-icon">📋</span>
              <div>
                <div class="ntd-title">Stamp duty calculator</div>
                <div class="ntd-sub">Calculate your stamp duty costs</div>
              </div>
            </div>
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#ftb'">
              <span class="ntd-icon">🔑</span>
              <div>
                <div class="ntd-title">First-time buyer guide</div>
                <div class="ntd-sub">HTB, First Home Scheme & more</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
 
      <div class="nav-right" style="position:relative">
        ${isLoggedIn ? `
          <div class="nav-user" id="nav-user-btn" onclick="toggleNavDropdown()">
            <div class="nav-avatar">${user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <span class="nav-user-name">${user?.name?.split(' ')[0] || 'Account'}</span>
            <span style="font-size:11px;color:#aaa">▾</span>
          </div>
          <div class="nav-dropdown" id="nav-dropdown">
            <div class="nav-dropdown-item" onclick="window.location.href='${root}pages/dashboard.html'">
              <span>🏠</span> My listings
            </div>
            <div class="nav-dropdown-item" onclick="window.location.href='${root}pages/dashboard.html?tab=enquiries'">
              <span>📨</span> Enquiries
            </div>
            <div class="nav-dropdown-item" onclick="window.location.href='${root}pages/dashboard.html?tab=profile'">
              <span>👤</span> Profile
            </div>
            <div class="nav-dropdown-divider"></div>
            <div class="nav-dropdown-item danger" onclick="window.API.auth.logout()">
              <span>↩</span> Sign out
            </div>
          </div>
        ` : `
          <a href="${root}pages/login.html" class="btn btn-ghost btn-sm">Sign in</a>
          <a href="${root}pages/register.html" class="btn btn-primary btn-sm">Register</a>
        `}
      </div>
    </div>
  `
 
  // Handle deep link to specific tool tab
  const hash = window.location.hash
  if (hash && ['#mortgage','#valuation','#stamp','#ftb'].includes(hash)) {
    const tabMap = { '#mortgage': 'mortgage', '#valuation': 'valuation', '#stamp': 'stamp', '#ftb': 'ftb' }
    setTimeout(() => {
      const tabId = tabMap[hash]
      const el = document.querySelector(`.tool-tab[onclick*="${tabId}"]`)
      if (el && typeof switchTab === 'function') switchTab(tabId, el)
    }, 100)
  }
}
 
function toggleToolsDropdown(e) {
  e.stopPropagation()
  const dd = document.getElementById('tools-dropdown')
  if (dd) dd.classList.toggle('open')
}
 
function toggleNavDropdown() {
  document.getElementById('nav-dropdown')?.classList.toggle('open')
}
 
// Close dropdowns on outside click
document.addEventListener('click', e => {
  const dd = document.getElementById('nav-dropdown')
  const btn = document.getElementById('nav-user-btn')
  if (dd && !btn?.contains(e.target) && !dd.contains(e.target)) {
    dd.classList.remove('open')
  }
  const tdd = document.getElementById('tools-dropdown')
  const tli = document.getElementById('tools-nav-item')
  if (tdd && !tli?.contains(e.target)) {
    tdd.classList.remove('open')
  }
})
// ── Property card HTML builder ────────────────────────────────────────────────
function buildPropertyCard(listing, savedIds = []) {
  const root = window.location.pathname.includes('/pages/') ? '' : 'pages/'
  const isSaved = savedIds.includes(listing.id)
  const photo = listing.primary_photo || listing.photos?.[0]?.url || null
  const imgContent = photo
    ? `<img src="${photo.startsWith('http') ? photo : window.MOVIN_API_URL + photo}" alt="${listing.title}" loading="lazy" />`
    : `<span style="font-size:52px">🏡</span>`

  const typeLabel = listing.listing_type === 'rent' ? 'To Rent' : listing.listing_type === 'share' ? 'Sharing' : 'For Sale'
  const badgeClass = listing.listing_type === 'rent' ? 'badge-orange' : listing.listing_type === 'share' ? 'badge-blue' : 'badge-green'

  return `
    <div class="prop-card" onclick="window.location.href='${root}listing.html?id=${listing.id}'">
      <div class="prop-card-img">
        ${imgContent}
        <div class="prop-card-tags">
          <span class="badge ${badgeClass}">${typeLabel}</span>
          ${listing.is_new_dev ? '<span class="badge badge-blue">New</span>' : ''}
        </div>
        <button class="prop-card-save ${isSaved ? 'saved' : ''}"
          onclick="event.stopPropagation(); toggleSave('${listing.id}', this)"
          title="${isSaved ? 'Unsave' : 'Save'}">
          ${isSaved ? '♥' : '♡'}
        </button>
      </div>
      <div class="prop-card-body">
        <div class="prop-card-loc">${listing.address_area || listing.county}</div>
        <div class="prop-card-title">${listing.title}</div>
        <div class="prop-card-price">${formatPrice(listing.price, listing.listing_type)}</div>
        <div class="prop-card-meta">
          ${listing.bedrooms ? `<span>🛏 ${listing.bedrooms} bed${listing.bedrooms > 1 ? 's' : ''}</span>` : ''}
          ${listing.bathrooms ? `<span>🚿 ${listing.bathrooms} bath${listing.bathrooms > 1 ? 's' : ''}</span>` : ''}
          ${listing.floor_size_m2 ? `<span>📐 ${listing.floor_size_m2}m²</span>` : ''}
          ${listing.ber_rating ? `<span>🔋 ${listing.ber_rating}</span>` : ''}
        </div>
      </div>
    </div>
  `
}

// ── Toggle save (heart button) ────────────────────────────────────────────────
async function toggleSave(listingId, btn) {
  if (!window.API.auth.isLoggedIn()) {
    toast('Sign in to save listings', 'info')
    return
  }
  const isSaved = btn.classList.contains('saved')
  try {
    if (isSaved) {
      await window.API.saved.unsave(listingId)
      btn.classList.remove('saved')
      btn.textContent = '♡'
      toast('Removed from saved')
    } else {
      await window.API.saved.save(listingId)
      btn.classList.add('saved')
      btn.textContent = '♥'
      toast('Saved to your list ♥')
    }
  } catch (e) {
    toast(e.message, 'error')
  }
}

window.toast = toast
window.formatPrice = formatPrice
window.timeAgo = timeAgo
window.requireLogin = requireLogin
window.renderNav = renderNav
window.buildPropertyCard = buildPropertyCard
window.toggleSave = toggleSave
