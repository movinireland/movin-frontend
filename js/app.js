// js/app.js — Shared utilities, nav, toast notifications

// ── Config ────────────────────────────────────────────────────────────────────
window.MOVIN_API_URL = 'https://movin-backend-production-1fb3.up.railway.app'

// ── Dark mode ────────────────────────────────────────────────────────────────
function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
function initTheme() {
  var saved = localStorage.getItem('movin_theme')
  if (!saved || saved === 'auto') {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('movin_theme', 'auto')
  } else {
    document.documentElement.setAttribute('data-theme', saved)
  }
  updateToggleBtn()
}
function updateToggleBtn() {
  var saved = localStorage.getItem('movin_theme') || 'auto'
  var isDark = saved === 'dark' || (saved === 'auto' && getSystemTheme() === 'dark')
  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.textContent = isDark ? '☀️' : '🌙'
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  })
}
function applyTheme(theme) {
  if (theme === 'auto') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('movin_theme', theme)
  updateToggleBtn()
}
function toggleTheme() {
  var saved = localStorage.getItem('movin_theme') || 'auto'
  var isDark = saved === 'dark' || (saved === 'auto' && getSystemTheme() === 'dark')
  applyTheme(isDark ? 'light' : 'dark')
}
window.toggleTheme = toggleTheme
window.initTheme = initTheme
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    var saved = localStorage.getItem('movin_theme')
    if (!saved || saved === 'auto') { document.documentElement.removeAttribute('data-theme'); updateToggleBtn() }
  })
}
initTheme()

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
        <button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">🌙</button>
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
  const imgSrc = photo ? (photo.startsWith('http') ? photo : window.MOVIN_API_URL + photo) : null

  const typeLabel = listing.listing_type === 'rent' ? 'To Rent' : listing.listing_type === 'share' ? 'Sharing' : 'For Sale'
  const typeBg    = listing.listing_type === 'rent' ? '#e07b3f' : listing.listing_type === 'share' ? '#1d4ed8' : '#1a5c45'
  const isNew     = listing.created_at && ((Date.now() - new Date(listing.created_at).getTime()) / 86400000) < 7
  const daysAgo   = Math.floor((Date.now() - new Date(listing.created_at).getTime()) / 86400000)
  const timeStr   = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : daysAgo + 'd ago'

  // BER colour class
  function berClass(ber) {
    if (!ber) return ''
    var r = ber.replace(/[^A-Za-z0-9]/g,'').toUpperCase()
    if (r.startsWith('A')) return 'ber-A' + (r[1]||'1')
    if (r.startsWith('B')) return 'ber-B' + (r[1]||'1')
    if (r.startsWith('C')) return 'ber-C' + (r[1]||'1')
    if (r.startsWith('D')) return 'ber-D' + (r[1]||'1')
    return 'ber-' + r
  }

  // Price drop
  let priceDropPct = 0
  if (listing.price_history) {
    try {
      const hist = typeof listing.price_history === 'string' ? JSON.parse(listing.price_history) : listing.price_history
      if (hist && hist.length > 0 && hist[0].price > listing.price)
        priceDropPct = Math.round(((hist[0].price - listing.price) / hist[0].price) * 100)
    } catch(e) {}
  }

  const berBadge = listing.ber_rating
    ? `<span class="ber-badge ${berClass(listing.ber_rating)}">${listing.ber_rating}</span>`
    : ''

  return `
    <div class="prop-card" onclick="window.location.href='${root}listing.html?id=${listing.id}'">
      <div class="prop-card-img" style="height:175px">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${listing.title}" loading="lazy" onload="this.classList.add('loaded')" style="width:100%;height:100%;object-fit:cover;display:block"/>`
          : `<div style="width:100%;height:175px;display:flex;align-items:center;justify-content:center;font-size:42px;background:linear-gradient(135deg,#c8dfd4,#e9f4ef)">🏡</div>`
        }
        <div class="prop-card-tags">
          ${listing.is_featured ? `<span style="background:linear-gradient(135deg,#e07b3f,#c9642a);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px">⭐ Featured</span>` : `<span style="background:${typeBg};color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px">${typeLabel}</span>`}
          ${isNew ? '<span style="background:#e07b3f;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px">✨ New</span>' : ''}
          ${priceDropPct > 0 ? `<span style="background:#dc2626;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px">▼ ${priceDropPct}%</span>` : ''}
        </div>
        <button class="prop-card-save ${isSaved ? 'saved' : ''}"
          onclick="event.stopPropagation();toggleSave('${listing.id}',this)"
          style="color:${isSaved ? '#e07b3f' : '#888'}">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="${isSaved ? '#e07b3f' : 'none'}" stroke="${isSaved ? '#e07b3f' : '#888'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button style="position:absolute;bottom:8px;left:8px;background:rgba(255,255,255,.9);border:none;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;color:#555;font-weight:700"
          onclick="event.stopPropagation();toggleCompare('${listing.id}','${listing.title.replace(/'/g,'').replace(/"/g,'')}','${listing.price}','${listing.listing_type}',this)">⊕</button>
        <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.55);color:#fff;font-size:9px;font-weight:500;padding:2px 7px;border-radius:10px">${timeStr}</div>
      </div>
      <div class="prop-card-body">
        <div class="prop-card-loc">${listing.address_area || listing.county}</div>
        <div class="prop-card-title">${listing.title}</div>
        <div class="prop-card-price">${formatPrice(listing.price, listing.listing_type)}</div>
        <div class="prop-card-meta">
          ${listing.bedrooms    ? `<span>${icon('bed',11,'#bbb')} ${listing.bedrooms}bd</span>` : ''}
          ${listing.bathrooms   ? `<span>${icon('bath',11,'#bbb')} ${listing.bathrooms}ba</span>` : ''}
          ${listing.floor_size_m2 ? `<span>${icon('size',11,'#bbb')} ${listing.floor_size_m2}m²</span>` : ''}
          ${listing.property_type ? `<span style="text-transform:capitalize">${listing.property_type}</span>` : ''}
          ${berBadge}
        </div>
      </div>
    </div>
  `
}
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
            '<a href="' + root + 'pages/sold.html">Sold &amp; let prices</a>' +
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
        '<div>' +
          '<div class="footer-col-title">Browse by county</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/area.html?county=Dublin">Dublin</a>' +
            '<a href="' + root + 'pages/area.html?county=Cork">Cork</a>' +
            '<a href="' + root + 'pages/area.html?county=Galway">Galway</a>' +
            '<a href="' + root + 'pages/area.html?county=Limerick">Limerick</a>' +
            '<a href="' + root + 'pages/area.html?county=Kerry">Kerry</a>' +
            '<a href="' + root + 'pages/area.html?county=Meath">Meath</a>' +
            '<a href="' + root + 'pages/area.html?county=Kildare">Kildare</a>' +
            '<a href="' + root + 'pages/area.html?county=Wicklow">Wicklow</a>' +
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
      return '<div onclick="window.location.href=\'' + root + 'listing.html?id=' + x.id + '\'" style="flex:0 0 140px;background:var(--white,#fff);border:1px solid #e8e4dc;border-radius:12px;overflow:hidden;cursor:pointer">' +
        '<div style="height:90px;overflow:hidden;background:#e9f4ef;display:flex;align-items:center;justify-content:center">' + thumb + '</div>' +
        '<div style="padding:.6rem">' +
          '<div style="font-size:11px;font-weight:500;color:var(--text,#111);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + x.title + '</div>' +
          '<div style="font-size:12px;color:#1a5c45;font-weight:500;margin-top:2px">€' + Number(x.price).toLocaleString('en-IE') + (x.type === 'rent' ? '/mo' : '') + '</div>' +
        '</div>' +
      '</div>'
    }).join('')
  } catch(e) { el.style.display = 'none' }
}
window.renderRecentlyViewed = renderRecentlyViewed

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

// ── Cookie Consent Banner ────────────────────────────────────────────────────
function initCookieConsent() {
  if (localStorage.getItem('movin_cookie_consent')) return

  var style = document.createElement('style')
  style.textContent = [
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#fff;border-top:1px solid #e8e4dc;box-shadow:0 -4px 24px rgba(0,0,0,.1);padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;font-family:"DM Sans",sans-serif;animation:cbUp .3s ease}',
    '@keyframes cbUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}',
    '@media(max-width:600px){#cookie-banner{flex-direction:column;align-items:flex-start;gap:.85rem;padding:1rem}#cb-btns{width:100%;display:flex;gap:.65rem}#cb-btns button{flex:1}}',
    '#cookie-banner p{margin:0;font-size:13px;color:#555;line-height:1.6;flex:1}',
    '#cookie-banner p a{color:#1a5c45;text-decoration:underline}',
    '#cb-accept{background:#1a5c45;color:#fff;border:none;border-radius:50px;padding:10px 22px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .15s}',
    '#cb-accept:hover{background:#0e3d2e}',
    '#cb-decline{background:transparent;color:#888;border:1.5px solid #e8e4dc;border-radius:50px;padding:9px 18px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s}',
    '#cb-decline:hover{border-color:#aaa;color:#555}',
    '[data-theme="dark"] #cookie-banner{background:#1a1a1a;border-top-color:#2a2a2a}',
    '[data-theme="dark"] #cookie-banner p{color:#aaa}',
    '[data-theme="dark"] #cb-decline{border-color:#333;color:#666}'
  ].join('')
  document.head.appendChild(style)

  var banner = document.createElement('div')
  banner.id = 'cookie-banner'

  var p = document.createElement('p')
  p.innerHTML = '&#x1F36A; We use cookies to improve your experience on Movin.ie. By continuing you agree to our <a href="/pages/privacy-policy.html">Privacy Policy</a>.'

  var btns = document.createElement('div')
  btns.id = 'cb-btns'

  var decline = document.createElement('button')
  decline.id = 'cb-decline'
  decline.textContent = 'Decline'
  decline.onclick = function() { dismissCookies('declined') }

  var accept = document.createElement('button')
  accept.id = 'cb-accept'
  accept.textContent = 'Accept all'
  accept.onclick = function() { dismissCookies('accepted') }

  btns.appendChild(decline)
  btns.appendChild(accept)
  banner.appendChild(p)
  banner.appendChild(btns)

  document.body.style.paddingBottom = '100px'
  document.body.appendChild(banner)
}

function dismissCookies(choice) {
  localStorage.setItem('movin_cookie_consent', choice)
  var banner = document.getElementById('cookie-banner')
  if (banner) {
    banner.style.transition = 'transform .25s ease, opacity .25s ease'
    banner.style.transform = 'translateY(100%)'
    banner.style.opacity = '0'
    setTimeout(function() {
      banner.remove()
      document.body.style.paddingBottom = ''
    }, 280)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent)
} else {
  setTimeout(initCookieConsent, 500)
}
