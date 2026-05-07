// js/app.js — Shared utilities, nav, toast notifications

// ── Config ────────────────────────────────────────────────────────────────────
window.MOVIN_API_URL = 'https://movin-backend-production-1fb3.up.railway.app'

// ── Icon system ───────────────────────────────────────────────────────────────
var MOVIN_ICON_IDS = {
  'home':'icon-home','search':'icon-search','location':'icon-location','map':'icon-map',
  'back':'icon-back','filter':'icon-filter','menu':'icon-menu','close':'icon-close',
  'chevron-down':'icon-chevron-down','chevron-right':'icon-chevron-right',
  'house':'icon-house','apartment':'icon-apartment','bungalow':'icon-bungalow','site':'icon-site',
  'bed':'icon-bed','bath':'icon-bath','size':'icon-size','ber':'icon-ber',
  'heart':'icon-heart','heart-filled':'icon-heart-filled','share':'icon-share',
  'message':'icon-message','phone':'icon-phone','plus':'icon-plus','trash':'icon-trash','edit':'icon-edit',
  'user':'icon-user','inbox':'icon-inbox','chart':'icon-chart','eye':'icon-eye',
  'settings':'icon-settings','signout':'icon-signout','bell':'icon-bell',
  'garden':'icon-garden','garage':'icon-garage','alarm':'icon-alarm',
  'wheelchair':'icon-wheelchair','pets':'icon-pets','sofa':'icon-sofa',
  'euro':'icon-euro','card':'icon-card','calculator':'icon-calculator',
  'document':'icon-document','key':'icon-key','camera':'icon-camera','upload':'icon-upload',
  'approve':'icon-approve','reject':'icon-reject','star':'icon-star',
  'parking':'icon-parking','new-dev':'icon-new-dev',
  'valuation':'icon-house','new-listing':'icon-plus'
}

function icon(name, size, color) {
  size  = size  || 24
  color = color || 'currentColor'
  var id = MOVIN_ICON_IDS[name]
  if (!id) return ''
  return '<svg width="' + size + '" height="' + size + '" style="color:' + color + ';flex-shrink:0;display:inline-block;vertical-align:middle" aria-hidden="true"><use href="/icons.svg#' + id + '"/></svg>'
}

function iconLabel(name, label, size, color) {
  return '<span style="display:inline-flex;align-items:center;gap:5px">' + icon(name, size || 16, color || 'currentColor') + '<span>' + label + '</span></span>'
}

window.icon = icon
window.iconLabel = iconLabel

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
              <span class="ntd-icon">${icon('calculator', 20, '#1a5c45')}</span>
              <div>
                <div class="ntd-title">Mortgage calculator</div>
                <div class="ntd-sub">Monthly repayments & affordability</div>
              </div>
            </div>
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#valuation'">
              <span class="ntd-icon">${icon('valuation', 20, '#1a5c45')}</span>
              <div>
                <div class="ntd-title">Home valuation</div>
                <div class="ntd-sub">Instant estimate based on Irish data</div>
              </div>
            </div>
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#stamp'">
              <span class="ntd-icon">${icon('document', 20, '#1a5c45')}</span>
              <div>
                <div class="ntd-title">Stamp duty calculator</div>
                <div class="ntd-sub">Calculate your stamp duty costs</div>
              </div>
            </div>
            <div class="ntd-item" onclick="event.stopPropagation();window.location.href='${root}pages/tools.html#ftb'">
              <span class="ntd-icon">${icon('key', 20, '#1a5c45')}</span>
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
              ${icon('house', 16)} My listings
            </div>
            <div class="nav-dropdown-item" onclick="window.location.href='${root}pages/dashboard.html?tab=enquiries'">
              ${icon('inbox', 16)} Enquiries
            </div>
            <div class="nav-dropdown-item" onclick="window.location.href='${root}pages/dashboard.html?tab=profile'">
              ${icon('user', 16)} Profile
            </div>
            <div class="nav-dropdown-divider"></div>
            <div class="nav-dropdown-item danger" onclick="window.API.auth.logout()">
              ${icon('signout', 16)} Sign out
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
setTimeout(function() { if (typeof renderFooter === 'function') renderFooter() }, 0)
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
  const isNew = listing.created_at && ((Date.now() - new Date(listing.created_at).getTime()) / 86400000) < 7
  // Price drop badge
  let priceDropPct = 0
  if (listing.price_history) {
    try {
      const hist = typeof listing.price_history === 'string' ? JSON.parse(listing.price_history) : listing.price_history
      if (hist && hist.length > 0) {
        const originalPrice = hist[0].price
        if (originalPrice > listing.price) {
          priceDropPct = Math.round(((originalPrice - listing.price) / originalPrice) * 100)
        }
      }
    } catch(e) {}
  }
  const badgeClass = listing.listing_type === 'rent' ? 'badge-orange' : listing.listing_type === 'share' ? 'badge-blue' : 'badge-green'

  return `
    <div class="prop-card" onclick="window.location.href='${root}listing.html?id=${listing.id}'">
      <div class="prop-card-img">
        ${imgContent}
        <div class="prop-card-tags">
          <span class="badge ${badgeClass}">${typeLabel}</span>
          ${listing.is_new_dev ? '<span class="badge badge-blue">New dev</span>' : ''}
          ${isNew && !listing.is_new_dev ? '<span class="badge" style="background:#e07b3f;color:#fff">New</span>' : ''}
          ${priceDropPct > 0 ? '<span class="badge" style="background:#dc2626;color:#fff">▼ ' + priceDropPct + '% reduced</span>' : ''}
        </div>
        <button class="prop-card-save ${isSaved ? 'saved' : ''}"
          onclick="event.stopPropagation(); toggleSave('${listing.id}', this)"
          title="${isSaved ? 'Unsave' : 'Save'}"
          style="font-size:16px;line-height:1;color:${isSaved ? '#e07b3f' : '#fff'}">
          ${isSaved ? '♥' : '♡'}
        </button>
        <button class="prop-card-compare"
          onclick="event.stopPropagation(); toggleCompare('${listing.id}', '${listing.title.replace(/'/g, '')}', '${listing.price}', '${listing.listing_type}', this)"
          title="Compare"
          style="position:absolute;bottom:7px;left:7px;background:rgba(255,255,255,.9);border:none;border-radius:50%;width:26px;height:26px;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;color:#555">
          ⊕
        </button>
      </div>
      <div class="prop-card-body">
        <div class="prop-card-loc">${listing.address_area || listing.county}</div>
        <div class="prop-card-title">${listing.title}</div>
        <div class="prop-card-price">${formatPrice(listing.price, listing.listing_type)}</div>
        <div class="prop-card-meta">
          ${listing.bedrooms ? `<span>${icon('bed', 13, '#aaa')} ${listing.bedrooms} bed${listing.bedrooms > 1 ? 's' : ''}</span>` : ''}
          ${listing.bathrooms ? `<span>${icon('bath', 13, '#aaa')} ${listing.bathrooms} bath${listing.bathrooms > 1 ? 's' : ''}</span>` : ''}
          ${listing.floor_size_m2 ? `<span>${icon('size', 13, '#aaa')} ${listing.floor_size_m2}m²</span>` : ''}
          ${listing.ber_rating ? `<span>${icon('ber', 13, '#aaa')} ${listing.ber_rating}</span>` : ''}
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
      btn.style.color = '#fff'
      toast('Removed from saved')
    } else {
      await window.API.saved.save(listingId)
      btn.classList.add('saved')
      btn.textContent = '♥'
      btn.style.color = '#e07b3f'
      toast('Saved to your list ♥')
    }
  } catch (e) {
    toast(e.message, 'error')
  }
}

// ── Compare properties ───────────────────────────────────────────────────────
var compareList = JSON.parse(localStorage.getItem('movin_compare') || '[]')

function toggleCompare(id, title, price, type, btn) {
  var idx = compareList.findIndex(function(x) { return x.id === id })
  if (idx > -1) {
    compareList.splice(idx, 1)
    if (btn) { btn.textContent = '⊕'; btn.style.background = 'rgba(255,255,255,.9)'; btn.style.color = '#555' }
  } else {
    if (compareList.length >= 3) { toast('Max 3 properties to compare', 'info'); return }
    compareList.push({ id: id, title: title, price: price, type: type })
    if (btn) { btn.textContent = '✓'; btn.style.background = '#1a5c45'; btn.style.color = '#fff' }
  }
  localStorage.setItem('movin_compare', JSON.stringify(compareList))
  updateCompareBar()
}

function updateCompareBar() {
  var bar = document.getElementById('compare-bar')
  if (!bar) return
  if (!compareList.length) { bar.style.display = 'none'; return }
  bar.style.display = 'flex'
  var root = window.location.pathname.includes('/pages/') ? '' : 'pages/'
  bar.innerHTML =
    '<div style="display:flex;align-items:center;gap:.75rem;flex:1;flex-wrap:wrap">' +
      '<span style="font-size:13px;font-weight:500;color:#111">' + compareList.length + '/3 selected</span>' +
      compareList.map(function(x) {
        return '<span style="background:#e9f4ef;color:#1a5c45;font-size:12px;padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px">' +
          x.title.substring(0,25) + (x.title.length>25?'…':'') +
          '<button onclick="removeCompare(\'' + x.id + '\')" style="background:none;border:none;cursor:pointer;color:#1a5c45;font-size:14px;padding:0;line-height:1">×</button>' +
        '</span>'
      }).join('') +
    '</div>' +
    (compareList.length >= 2 ?
      '<a href="' + root + 'compare.html" class="btn btn-primary btn-sm">Compare →</a>' :
      '<span style="font-size:12px;color:#aaa">Select ' + (2-compareList.length) + ' more</span>'
    ) +
    '<button onclick="clearCompare()" style="background:none;border:none;cursor:pointer;color:#aaa;font-size:18px;padding:4px">×</button>'
}

function clearCompare() {
  compareList = []
  localStorage.setItem('movin_compare', '[]')
  updateCompareBar()
  document.querySelectorAll('.prop-card-compare').forEach(function(b) {
    b.textContent = '⊕'; b.style.background = 'rgba(255,255,255,.9)'; b.style.color = '#555'
  })
}

function removeCompare(id) {
  var idx = compareList.findIndex(function(x) { return x.id === id })
  if (idx > -1) { compareList.splice(idx, 1) }
  localStorage.setItem('movin_compare', JSON.stringify(compareList))
  updateCompareBar()
}
window.removeCompare = removeCompare
window.toggleCompare = toggleCompare
window.updateCompareBar = updateCompareBar
window.clearCompare = clearCompare

window.toast = toast
window.formatPrice = formatPrice
window.timeAgo = timeAgo
window.requireLogin = requireLogin
window.renderNav = renderNav
window.buildPropertyCard = buildPropertyCard
window.toggleSave = toggleSave

// ── Render footer ─────────────────────────────────────────────────────────────
function renderFooter() {
  var root = window.location.pathname.includes('/pages/') ? '../' : './'
  var footer = document.getElementById('site-footer')
  if (!footer) return
  footer.innerHTML =
    '<div class="footer-inner">' +
      '<div class="footer-top">' +
        '<div>' +
          '<div class="footer-brand-logo">mov<span>in</span></div>' +
          '<div class="footer-brand-tag">Ireland\'s home for<br>finding your home.</div>' +
          '<div style="display:flex;gap:10px;margin-top:.5rem">' +
            '<a href="https://www.facebook.com/movin.ie" target="_blank" style="color:rgba(255,255,255,.5);font-size:13px;text-decoration:none">Facebook</a>' +
            '<a href="https://www.instagram.com/movin.ie" target="_blank" style="color:rgba(255,255,255,.5);font-size:13px;text-decoration:none">Instagram</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Search</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/search.html?listing_type=sale">Properties for sale</a>' +
            '<a href="' + root + 'pages/search.html?listing_type=rent">Properties to rent</a>' +
            '<a href="' + root + 'pages/search.html?listing_type=share">Sharing</a>' +
            '<a href="' + root + 'pages/map-search.html">Map search</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Tools</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/tools.html#mortgage">Mortgage calculator</a>' +
            '<a href="' + root + 'pages/tools.html#valuation">Home valuation</a>' +
            '<a href="' + root + 'pages/tools.html#stamp">Stamp duty</a>' +
            '<a href="' + root + 'pages/tools.html#ftb">First-time buyer</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Company</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/about.html">About us</a>' +
            '<a href="' + root + 'pages/list.html">List your property</a>' +
            '<a href="mailto:hello@movin.ie">Contact</a>' +
            '<a href="' + root + 'pages/privacy-policy.html">Privacy policy</a>' +
            '<a href="' + root + 'pages/terms-of-service.html">Terms of service</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<div class="footer-copy">© ' + new Date().getFullYear() + ' Movin Technologies Ltd · Republic of Ireland</div>' +
        '<div class="footer-legal">' +
          '<a href="' + root + 'pages/privacy-policy.html">Privacy</a>' +
          '<a href="' + root + 'pages/terms-of-service.html">Terms</a>' +
          '<a href="mailto:hello@movin.ie">hello@movin.ie</a>' +
        '</div>' +
      '</div>' +
    '</div>'
}
window.renderFooter = renderFooter

// ── Recently viewed ───────────────────────────────────────────────────────────
function renderRecentlyViewed(containerId, excludeId) {
  var el = document.getElementById(containerId)
  if (!el) return
  try {
    var rv = JSON.parse(localStorage.getItem('movin_rv') || '[]')
    rv = rv.filter(function(x) { return x.id !== excludeId }).slice(0, 4)
    if (!rv.length) { el.style.display = 'none'; return }
    el.innerHTML = rv.map(function(x) {
      var photo = x.photo ? (x.photo.startsWith('http') ? x.photo : window.MOVIN_API_URL + x.photo) : null
      var thumb = photo ? '<img src="' + photo + '" style="width:100%;height:100%;object-fit:cover" loading="lazy"/>' : '<span style="font-size:22px">🏡</span>'
      var root = window.location.pathname.includes('/pages/') ? '' : 'pages/'
      return '<div onclick="window.location.href=\'' + root + 'listing.html?id=' + x.id + '\'" style="flex:0 0 140px;background:#fff;border:1px solid #e8e4dc;border-radius:12px;overflow:hidden;cursor:pointer">' +
        '<div style="height:90px;overflow:hidden;background:#e9f4ef;display:flex;align-items:center;justify-content:center">' + thumb + '</div>' +
        '<div style="padding:.6rem">' +
          '<div style="font-size:11px;font-weight:500;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + x.title + '</div>' +
          '<div style="font-size:12px;color:#1a5c45;font-weight:500;margin-top:2px">€' + Number(x.price).toLocaleString('en-IE') + (x.type === 'rent' ? '/mo' : '') + '</div>' +
        '</div>' +
      '</div>'
    }).join('')
  } catch(e) { el.style.display = 'none' }
}
window.renderRecentlyViewed = renderRecentlyViewed

// ── Load icon sprite ──────────────────────────────────────────────────────────
function loadIconSprite() {
  if (document.getElementById('movin-icon-sprite')) return
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/icons.svg', true)
  xhr.onload = function() {
    if (xhr.status === 200) {
      var div = document.createElement('div')
      div.id = 'movin-icon-sprite'
      div.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;top:0;left:0'
      div.innerHTML = xhr.responseText
      document.body.insertBefore(div, document.body.firstChild)
    }
  }
  xhr.send()
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadIconSprite)
} else {
  loadIconSprite()
}
