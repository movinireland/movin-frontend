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
    var hasTabBar = document.body.classList.contains('has-tab-bar')
    var bottomMobile = hasTabBar ? 'calc(76px + env(safe-area-inset-bottom, 0px))' : '1.25rem'
    c.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:8px'
    var mq = window.matchMedia('(max-width:767px)')
    function applyPos(){
      if (mq.matches) { c.style.bottom = bottomMobile; c.style.right = '1rem'; c.style.left = '1rem' }
      else            { c.style.bottom = '1.5rem'; c.style.right = '1.5rem'; c.style.left = 'auto' }
    }
    applyPos()
    if (mq.addEventListener) mq.addEventListener('change', applyPos)
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
        <!-- Buy dropdown — residential only, each item links to a dedicated page -->
        <li class="nav-has-dropdown ${activePage === 'buy' ? 'active' : ''}">
          <span>Buy <span class="ntd-caret">▾</span></span>
          <div class="nav-tools-dropdown">
            <a class="ntd-item" href="${root}pages/house-for-sale.html">
              <span class="ntd-icon">${icon('house', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Houses for sale</div><div class="ntd-sub">Detached, semi-d, terrace</div></div>
            </a>
            <a class="ntd-item" href="${root}pages/apartment-for-sale.html">
              <span class="ntd-icon">${icon('apartment', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Apartments for sale</div><div class="ntd-sub">City-centre &amp; suburban units</div></div>
            </a>
            <a class="ntd-item" href="${root}pages/bungalow-for-sale.html">
              <span class="ntd-icon">${icon('bungalow', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Bungalows for sale</div><div class="ntd-sub">Single-storey homes</div></div>
            </a>
            <a class="ntd-item" href="${root}pages/site-for-sale.html">
              <span class="ntd-icon">${icon('site', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Sites &amp; Land</div><div class="ntd-sub">Build your own</div></div>
            </a>
          </div>
        </li>

        <!-- Rent dropdown — residential only, each item links to a dedicated page -->
        <li class="nav-has-dropdown ${activePage === 'rent' ? 'active' : ''}">
          <span>Rent <span class="ntd-caret">▾</span></span>
          <div class="nav-tools-dropdown">
            <a class="ntd-item" href="${root}pages/house-for-rent.html">
              <span class="ntd-icon">${icon('house', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Houses to rent</div><div class="ntd-sub">Detached, semi-d, terrace</div></div>
            </a>
            <a class="ntd-item" href="${root}pages/apartment-for-rent.html">
              <span class="ntd-icon">${icon('apartment', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Apartments to rent</div><div class="ntd-sub">City-centre &amp; suburban units</div></div>
            </a>
            <a class="ntd-item" href="${root}pages/bungalow-for-rent.html">
              <span class="ntd-icon">${icon('bungalow', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Bungalows to rent</div><div class="ntd-sub">Single-storey rentals</div></div>
            </a>
            <a class="ntd-item" href="${root}pages/sharing.html">
              <span class="ntd-icon">${icon('user', 20, '#1a5c45')}</span>
              <div><div class="ntd-title">Sharing &amp; rooms</div><div class="ntd-sub">Single rooms in shared homes</div></div>
            </a>
          </div>
        </li>

        <li class="${activePage === 'commercial' ? 'active' : ''}"
            onclick="window.location.href='${root}pages/commercial.html'">Commercial</li>

        <li class="${activePage === 'list' ? 'active' : ''}"
            onclick="window.location.href='${root}pages/list.html'">List your property</li>
 
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
  // Bind hover open/close on all dropdown triggers — JS is more reliable here
  // than pure :hover, which can be flaky once an LI also has an onclick.
  setTimeout(bindNavDropdowns, 0)
}

// ── Hover-open dropdown menus on .nav-has-dropdown items ─────────────────
// Used by Buy / Rent dropdowns on every page. Re-runs after renderNav()
// rebuilds the nav, and also fires on first DOMContentLoaded so the inline
// nav on index.html gets it too.
// ── Property-type landing pages ──────────────────────────────────────────
// Each dedicated page (house-for-sale.html, apartment-for-rent.html, …) calls
// this with its config. We render a shared layout: hero + sibling pills +
// quick filters + listing grid + advanced-search CTA.
function renderTypeLanding(opts){
  var listingType  = opts.listingType    // 'sale' | 'rent' | 'share'
  var propertyType = opts.propertyType   // 'house' | 'apartment' | 'bungalow' | 'site' | ''
  var h1           = opts.h1
  var intro        = opts.intro
  var eyebrow      = opts.eyebrow || (listingType === 'sale' ? 'Buy' : (listingType === 'rent' ? 'Rent' : 'Share'))
  var siblings     = opts.siblings || []
  var navActive    = opts.navActive
  var seoFaq       = opts.faq || null

  // Header / footer
  if (typeof renderNav === 'function') renderNav(navActive)

  var root = window.location.pathname.includes('/pages/') ? '' : 'pages/'

  // Hero
  var heroHTML =
    '<section class="tlp-hero">' +
      '<div class="tlp-inner">' +
        '<div class="tlp-eyebrow">' + eyebrow + '</div>' +
        '<h1 class="tlp-h1">' + h1 + '</h1>' +
        '<p class="tlp-sub">' + intro + '</p>' +
        '<form class="tlp-filters" onsubmit="event.preventDefault();tlpSubmit()">' +
          '<select id="tlp-county" class="tlp-sel"><option value="">Any county</option></select>' +
          '<select id="tlp-beds"   class="tlp-sel"><option value="">Beds</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>' +
          '<select id="tlp-max"    class="tlp-sel"></select>' +
          '<button type="submit" class="tlp-go">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
            'Search' +
          '</button>' +
        '</form>' +
      '</div>' +
    '</section>'

  // Sibling pills
  var sibHTML = ''
  if (siblings.length){
    sibHTML =
      '<div class="tlp-siblings">' +
        '<span class="tlp-sib-label">' + (listingType === 'rent' ? 'Or rent' : (listingType === 'share' ? 'Or buy / rent' : 'Or look at')) + ':</span>' +
        siblings.map(function(s){
          return '<a class="tlp-sib" href="' + s.href + '">' + (s.icon ? '<svg width="14" height="14"><use href="/icons.svg#' + s.icon + '"/></svg>' : '') + s.label + '</a>'
        }).join('') +
      '</div>'
  }

  // Results shell
  var resultsHTML =
    '<section class="tlp-results">' +
      '<div class="tlp-results-hdr">' +
        '<h2 id="tlp-count">Loading…</h2>' +
        '<select class="tlp-sort" id="tlp-sort" onchange="tlpRender()">' +
          '<option value="newest">Newest first</option>' +
          '<option value="price_asc">Price low → high</option>' +
          '<option value="price_desc">Price high → low</option>' +
        '</select>' +
      '</div>' +
      '<div id="tlp-grid" class="listings-grid">' +
        Array(8).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line sm"></div><div class="skeleton-line lg"></div><div class="skeleton-line md"></div></div></div>').join('') +
      '</div>' +
      '<div class="tlp-cta-row">' +
        '<a class="btn btn-primary" id="tlp-see-all">Open advanced search →</a>' +
      '</div>' +
    '</section>'

  // FAQ block (optional)
  var faqHTML = ''
  if (seoFaq && seoFaq.length){
    faqHTML =
      '<section class="tlp-faq">' +
        '<h2>Frequently asked</h2>' +
        seoFaq.map(function(q){
          return '<details class="tlp-faq-item"><summary>' + q.q + '</summary><div class="tlp-faq-a">' + q.a + '</div></details>'
        }).join('') +
      '</section>'
  }

  // Mount
  var host = document.getElementById('type-page')
  if (!host) {
    host = document.createElement('div')
    host.id = 'type-page'
    document.body.appendChild(host)
  }
  host.innerHTML = heroHTML + sibHTML + resultsHTML + faqHTML

  // Footer
  if (typeof renderFooter === 'function') setTimeout(renderFooter, 0)

  // Hydrate counties + max-price options
  var COUNTIES = ['Dublin','Cork','Galway','Limerick','Waterford','Kerry','Meath','Kildare','Wicklow','Wexford','Kilkenny','Clare','Tipperary','Donegal','Mayo','Sligo','Leitrim','Roscommon','Longford','Westmeath','Offaly','Laois','Carlow','Louth','Monaghan','Cavan']
  var cSel = document.getElementById('tlp-county')
  COUNTIES.forEach(function(c){ var o = document.createElement('option'); o.value = c; o.textContent = c; cSel.appendChild(o) })

  var maxOpts = listingType === 'sale'
    ? [['',''],['200000','Up to €200k'],['300000','Up to €300k'],['500000','Up to €500k'],['750000','Up to €750k'],['1000000','Up to €1m'],['1500000','Up to €1.5m']]
    : [['',''],['1000','Up to €1k/mo'],['1500','Up to €1.5k/mo'],['2000','Up to €2k/mo'],['2500','Up to €2.5k/mo'],['3000','Up to €3k/mo'],['4000','Up to €4k/mo']]
  var mSel = document.getElementById('tlp-max')
  mSel.innerHTML = ''
  maxOpts.forEach(function(o){ var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1] || (listingType === 'sale' ? 'Max price' : 'Max rent'); mSel.appendChild(op) })

  // Pre-fill from URL if any
  var u = new URLSearchParams(location.search)
  if (u.get('county')) cSel.value = u.get('county')
  if (u.get('bedrooms')) document.getElementById('tlp-beds').value = u.get('bedrooms')
  if (u.get('max_price')) mSel.value = u.get('max_price')

  // ── Cached state + render fn ────────────────────────────────────────────
  var ALL = []
  function tlpFetch(){
    var p = { listing_type: listingType, sort:'newest', limit: 60 }
    if (propertyType) p.property_type = propertyType
    var county = cSel.value, beds = document.getElementById('tlp-beds').value, max = mSel.value
    if (county) p.county = county
    if (beds)   p.bedrooms = beds
    if (max)    p.max_price = max
    document.getElementById('tlp-count').textContent = 'Loading ' + h1.toLowerCase().replace(/^[a-z]/, function(c){return c.toUpperCase()}) + '…'
    var grid = document.getElementById('tlp-grid')
    grid.innerHTML = Array(8).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line sm"></div><div class="skeleton-line lg"></div><div class="skeleton-line md"></div></div></div>').join('')

    return window.API.listings.search(p).then(function(res){
      ALL = (res && res.listings) || []
      tlpRender()
      // Update advanced-search CTA URL with current filters
      var urlP = new URLSearchParams()
      urlP.set('listing_type', listingType)
      if (propertyType) urlP.set('property_type', propertyType)
      if (county) urlP.set('county', county)
      if (beds)   urlP.set('bedrooms', beds)
      if (max)    urlP.set('max_price', max)
      document.getElementById('tlp-see-all').href = root + 'search.html?' + urlP.toString()
    }).catch(function(){
      document.getElementById('tlp-grid').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:#aaa;font-size:14px">Could not load listings — please try again.</div>'
      document.getElementById('tlp-count').textContent = 'Could not load'
    })
  }
  function tlpRender(){
    var sort = document.getElementById('tlp-sort').value
    var rows = ALL.slice()
    if (sort === 'price_asc')  rows.sort(function(a,b){return (a.price||0)-(b.price||0)})
    if (sort === 'price_desc') rows.sort(function(a,b){return (b.price||0)-(a.price||0)})
    if (sort === 'newest')     rows.sort(function(a,b){return new Date(b.created_at||0) - new Date(a.created_at||0)})

    var grid = document.getElementById('tlp-grid')
    var hdr  = document.getElementById('tlp-count')
    if (!rows.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;background:#fff;border:1px dashed #e8e4dc;border-radius:16px"><div style="font-family:Playfair Display,serif;font-size:18px;color:#111;margin-bottom:.5rem">No matches yet</div><p style="font-size:13px;color:#888;margin-bottom:1rem">Be the first to list — your first listing on Movin is free.</p><a class="btn btn-primary" href="' + root + 'list.html">List a property →</a></div>'
      hdr.textContent = 'No ' + h1.toLowerCase() + ' yet'
      return
    }
    hdr.innerHTML = '<strong>' + rows.length + '</strong> ' + h1.toLowerCase()
    grid.innerHTML = rows.map(function(l){
      try { return window.buildPropertyCard(l, []) } catch(e){ return '' }
    }).join('')
  }
  window.tlpRender = tlpRender
  window.tlpSubmit = tlpFetch
  ;[cSel, document.getElementById('tlp-beds'), mSel].forEach(function(el){
    if (el) el.addEventListener('change', tlpFetch)
  })

  // SEO: rewrite document title + meta description from the H1/intro
  document.title = h1 + ' – Movin.ie'
  var md = document.querySelector('meta[name="description"]')
  if (md && intro) md.setAttribute('content', intro)

  tlpFetch()
}
window.renderTypeLanding = renderTypeLanding

function bindNavDropdowns(){
  var closeTimer = null
  document.querySelectorAll('.nav-has-dropdown').forEach(function(li){
    if (li.dataset.ddBound) return
    li.dataset.ddBound = '1'
    var dd = li.querySelector('.nav-tools-dropdown')
    if (!dd) return
    li.addEventListener('mouseenter', function(){
      clearTimeout(closeTimer)
      // Close any other dropdown that's still open
      document.querySelectorAll('.nav-tools-dropdown.open').forEach(function(o){
        if (o !== dd) o.classList.remove('open')
      })
      dd.classList.add('open')
    })
    li.addEventListener('mouseleave', function(){
      closeTimer = setTimeout(function(){ dd.classList.remove('open') }, 120)
    })
    // Keep the menu open while the cursor is over the menu itself
    dd.addEventListener('mouseenter', function(){ clearTimeout(closeTimer) })
    dd.addEventListener('mouseleave', function(){
      closeTimer = setTimeout(function(){ dd.classList.remove('open') }, 120)
    })
  })
}
window.bindNavDropdowns = bindNavDropdowns
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindNavDropdowns)
else bindNavDropdowns()

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
        <div class="prop-card-loc" onclick="event.stopPropagation();window.location.href='${root}neighbourhood.html?area=${encodeURIComponent(listing.address_area||listing.county)}&county=${encodeURIComponent(listing.county)}'" style="cursor:pointer;-webkit-tap-highlight-color:transparent" title="View neighbourhood guide">${listing.address_area || listing.county} ↗</div>
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
            '<a href="' + root + 'pages/drive-time.html">Find by drive time</a>' +
            '<a href="' + root + 'pages/latest.html">Latest listings</a>' +
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
            '<a href="' + root + 'pages/commercial.html">Commercial property</a>' +
            '<a href="' + root + 'pages/sold.html">Sold &amp; let prices</a>' +
            '<a href="' + root + 'pages/contact.html">Contact us</a>' +
            '<a href="' + root + 'pages/privacy-policy.html">Privacy policy</a>' +
            '<a href="' + root + 'pages/terms-of-service.html">Terms of service</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Neighbourhood guides</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Dublin%204&county=Dublin">Dublin 4</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Dublin%206&county=Dublin">Dublin 6</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Rathmines&county=Dublin">Rathmines</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Blackrock&county=Dublin">Blackrock</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Malahide&county=Dublin">Malahide</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Swords&county=Dublin">Swords</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Galway%20City%20Centre&county=Galway">Galway City</a>' +
            '<a href="' + root + 'pages/neighbourhood.html?area=Cork%20City%20Centre&county=Cork">Cork City</a>' +
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

// ── Persistent mobile tab bar + fancy back button (auto-injected) ────────────
;(function() {
  function isInPagesDir() {
    return /\/pages\//.test(location.pathname)
  }
  function pathPrefix() {
    return isInPagesDir() ? '../' : ''
  }
  function isHome() {
    var p = location.pathname.toLowerCase()
    return p === '/' || p === '' || /\/index\.html?$/.test(p) || /\/index$/.test(p)
  }
  function activeTab() {
    var p = location.pathname.toLowerCase()
    if (isHome()) return 'home'
    if (/\/map-search\.html$/.test(p)) return 'map'
    if (/\/list\.html$/.test(p)) return 'list'
    if (/\/(search|listing|sold|area|neighbourhood|agent|compare|commercial|latest|drive-time)\.html$/.test(p)) return 'search'
    if (/\/(dashboard|login|register|payment-success)/.test(p) || /\/admin\//.test(p)) return 'account'
    return ''
  }

  var BACK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'

  function buildTabBarHTML() {
    var p = pathPrefix()
    var a = activeTab()
    function cls(name) { return 'tab-item' + (a === name ? ' active' : '') }
    return '' +
      '<nav class="tab-bar" role="navigation" aria-label="Primary">' +
        '<a class="' + cls('home') + '" href="' + p + 'index.html" aria-label="Home">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-home"/></svg></span>Home' +
        '</a>' +
        '<a class="' + cls('search') + '" href="' + p + 'pages/search.html" aria-label="Search">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-search"/></svg></span>Search' +
        '</a>' +
        '<a class="tab-list-item" href="' + p + 'pages/list.html" aria-label="List your property">' +
          '<span class="tab-list-circle"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-plus"/></svg></span>' +
          '<span class="tab-list-label">List</span>' +
        '</a>' +
        '<a class="' + cls('map') + '" href="' + p + 'pages/map-search.html" aria-label="Map">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-map"/></svg></span>Map' +
        '</a>' +
        '<a class="' + cls('account') + '" href="' + p + 'pages/dashboard.html" aria-label="Account">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-user"/></svg></span>Account' +
        '</a>' +
      '</nav>'
  }

  function goBack() {
    try {
      var sameOrigin = document.referrer && new URL(document.referrer, location.href).origin === location.origin
      if (history.length > 1 && sameOrigin) { history.back(); return }
    } catch(e) {}
    location.href = pathPrefix() + 'index.html'
  }
  window.movinGoBack = goBack

  function injectTabBar() {
    if (document.querySelector('.tab-bar')) {
      // Existing tab bar — just mark body so padding-bottom kicks in
      document.body.classList.add('has-tab-bar')
      return
    }
    document.body.insertAdjacentHTML('beforeend', buildTabBarHTML())
    document.body.classList.add('has-tab-bar')
  }

  function injectBackButton() {
    if (isHome()) return
    if (document.body.hasAttribute('data-no-back')) return
    if (document.querySelector('.mobile-back-btn, .nav-back, .back-btn')) return

    var navInner = document.querySelector('.nav .nav-inner')
    if (navInner) {
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'nav-back'
      b.setAttribute('aria-label', 'Back')
      b.innerHTML = BACK_SVG
      b.addEventListener('click', goBack)
      navInner.insertBefore(b, navInner.firstChild)
      return
    }

    var floating = document.createElement('button')
    floating.type = 'button'
    floating.className = 'mobile-back-btn'
    floating.setAttribute('aria-label', 'Back')
    floating.innerHTML = BACK_SVG
    floating.addEventListener('click', goBack)
    document.body.appendChild(floating)
  }

  function init() {
    injectTabBar()
    // Defer back-button so any page-level renderNav() in a DOMContentLoaded
    // handler has a chance to populate .nav-inner first.
    setTimeout(injectBackButton, 0)
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()

// ── Global mobile sticky quick-search bar (auto-injected) ───────────────────
;(function() {
  // Pages where the sticky search would duplicate an already-prominent
  // search experience and just clutter the UI.
  function pageHasOwnSearch() {
    var p = location.pathname.toLowerCase()
    if (p === '/' || p === '' || /\/index\.html?$/.test(p)) return true
    if (/\/(search|map-search|drive-time|commercial|latest)\.html$/.test(p)) return true
    return false
  }
  function pathPrefix() { return /\/pages\//.test(location.pathname) ? '../' : '' }

  var googleMapsLoading = false
  function ensureGoogleMaps(cb) {
    if (window.google && google.maps && google.maps.places) { cb && cb(); return }
    if (googleMapsLoading) {
      var i = 0
      var iv = setInterval(function(){
        if (window.google && google.maps && google.maps.places) {
          clearInterval(iv); cb && cb()
        } else if (++i > 80) clearInterval(iv)
      }, 100)
      return
    }
    googleMapsLoading = true
    window._qsearchOnReady = function() { cb && cb() }
    var s = document.createElement('script')
    s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAvuyk032ZHZ1L_ZlFfqMhOSVz1Vncp6hk&libraries=places&callback=_qsearchOnReady&v=weekly'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }

  function injectQuickSearch() {
    if (pageHasOwnSearch()) return
    if (document.querySelector('.qsearch-strip')) return

    // Sticky pill at the top
    var strip = document.createElement('div')
    strip.className = 'qsearch-strip'
    strip.innerHTML =
      '<button type="button" class="qsearch-trigger" aria-label="Search properties">' +
        '<span class="qs-search-icon">' +
          '<svg viewBox="0 0 24 24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
        '</span>' +
        '<span class="qs-text" id="qsearch-text">Search homes, areas or Eircodes…</span>' +
        '<span class="qs-mode-pill" id="qsearch-mode-pill">Buy</span>' +
      '</button>'
    // Insert at the very top of <body> so it's always visible
    document.body.insertBefore(strip, document.body.firstChild)
    document.body.classList.add('has-qsearch')

    // Modal sheet
    var modal = document.createElement('div')
    modal.className = 'qsearch-modal'
    modal.id = 'qsearch-modal'
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    modal.innerHTML =
      '<div class="qsearch-sheet" role="document">' +
        '<div class="qsearch-handle"></div>' +
        '<div class="qsearch-head">' +
          '<div class="qsearch-title">Find your home</div>' +
          '<button class="qsearch-close" type="button" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="qsearch-tabs" role="tablist">' +
          '<button type="button" class="on" data-mode="sale">Buy</button>' +
          '<button type="button" data-mode="rent">Rent</button>' +
          '<button type="button" data-mode="share">Sharing</button>' +
        '</div>' +
        '<div class="qsearch-input-wrap">' +
          '<svg class="qs-pin" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          '<input class="qsearch-input" id="qsearch-input" type="text" autocomplete="off" placeholder="Address, university, town, county or Eircode…"/>' +
        '</div>' +
        '<div class="qsearch-filters">' +
          '<div>' +
            '<label for="qsearch-beds">Beds</label>' +
            '<select id="qsearch-beds">' +
              '<option value="">Any</option>' +
              '<option value="1">1+</option>' +
              '<option value="2">2+</option>' +
              '<option value="3">3+</option>' +
              '<option value="4">4+</option>' +
              '<option value="5">5+</option>' +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label for="qsearch-min">Min €</label>' +
            '<select id="qsearch-min">' +
              '<option value="">No min</option>' +
              '<option value="100000">€100k</option>' +
              '<option value="200000">€200k</option>' +
              '<option value="300000">€300k</option>' +
              '<option value="500000">€500k</option>' +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label for="qsearch-max">Max €</label>' +
            '<select id="qsearch-max">' +
              '<option value="">No max</option>' +
              '<option value="200000">€200k</option>' +
              '<option value="300000">€300k</option>' +
              '<option value="500000">€500k</option>' +
              '<option value="750000">€750k</option>' +
              '<option value="1000000">€1m+</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<button class="qsearch-submit" type="button" id="qsearch-submit">' +
          '<svg viewBox="0 0 24 24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
          'Search properties' +
        '</button>' +
        '<div class="qsearch-shortcuts">' +
          '<button type="button" class="qsearch-shortcut" data-county="Dublin">Dublin</button>' +
          '<button type="button" class="qsearch-shortcut" data-county="Cork">Cork</button>' +
          '<button type="button" class="qsearch-shortcut" data-county="Galway">Galway</button>' +
          '<button type="button" class="qsearch-shortcut" data-county="Wicklow">Wicklow</button>' +
          '<button type="button" class="qsearch-shortcut" data-county="Kildare">Kildare</button>' +
          '<button type="button" class="qsearch-shortcut" data-county="Meath">Meath</button>' +
        '</div>' +
      '</div>'
    document.body.appendChild(modal)

    var state = { mode: 'sale', origin: null }   // origin: { lat, lng, label }

    function setMode(m) {
      state.mode = m
      modal.querySelectorAll('.qsearch-tabs button').forEach(function(b){
        b.classList.toggle('on', b.dataset.mode === m)
      })
      var pill = document.getElementById('qsearch-mode-pill')
      if (pill) pill.textContent = m === 'sale' ? 'Buy' : (m === 'rent' ? 'Rent' : 'Share')
    }
    function open() {
      modal.classList.add('open')
      document.documentElement.style.overflow = 'hidden'
      ensureGoogleMaps(attachPlaces)
      setTimeout(function(){ document.getElementById('qsearch-input').focus() }, 200)
    }
    function close() {
      modal.classList.remove('open')
      document.documentElement.style.overflow = ''
    }
    strip.querySelector('.qsearch-trigger').addEventListener('click', open)
    modal.querySelector('.qsearch-close').addEventListener('click', close)
    modal.addEventListener('click', function(e){ if (e.target === modal) close() })
    modal.querySelectorAll('.qsearch-tabs button').forEach(function(b){
      b.addEventListener('click', function(){ setMode(b.dataset.mode) })
    })
    modal.querySelectorAll('.qsearch-shortcut').forEach(function(b){
      b.addEventListener('click', function(){
        submit({ county: b.dataset.county })
      })
    })
    document.getElementById('qsearch-submit').addEventListener('click', function(){ submit() })
    document.getElementById('qsearch-input').addEventListener('keydown', function(e){
      if (e.key === 'Enter') submit()
      if (e.key === 'Escape') close()
    })

    function attachPlaces() {
      var input = document.getElementById('qsearch-input')
      if (!input || input.dataset.acBound) return
      if (!window.google || !google.maps || !google.maps.places) return
      input.dataset.acBound = '1'
      var ac = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'ie' },
        fields: ['geometry','name','formatted_address','address_components','types']
      })
      ac.addListener('place_changed', function(){
        var place = ac.getPlace()
        if (!place || !place.geometry || !place.geometry.location) return
        var loc = place.geometry.location
        var label = (place.name && place.formatted_address && place.formatted_address.indexOf(place.name) !== 0)
          ? place.name + ' — ' + place.formatted_address
          : (place.formatted_address || place.name || input.value)
        var comp = place.address_components || []
        function pick(t){ var c = comp.find(function(x){return x.types.indexOf(t)!==-1}); return c ? c.long_name : '' }
        state.origin = {
          lat:   typeof loc.lat === 'function' ? loc.lat() : loc.lat,
          lng:   typeof loc.lng === 'function' ? loc.lng() : loc.lng,
          label: label,
          county: (pick('administrative_area_level_1') || pick('administrative_area_level_2')).replace(/^County\s+/i,'')
        }
        // Auto-submit on pick — feels snappy
        submit()
      })
    }

    function submit(extra) {
      var p   = new URLSearchParams()
      var q   = document.getElementById('qsearch-input').value.trim()
      var beds= document.getElementById('qsearch-beds').value
      var min = document.getElementById('qsearch-min').value
      var max = document.getElementById('qsearch-max').value
      p.set('listing_type', state.mode)
      if (state.origin) {
        p.set('lat',  state.origin.lat)
        p.set('lng',  state.origin.lng)
        p.set('near', state.origin.label)
        if (state.origin.county) p.set('county', state.origin.county)
      } else if (extra && extra.county) {
        p.set('county', extra.county)
      } else if (q) {
        p.set('q', q)
      }
      if (beds) p.set('bedrooms', beds)
      if (min)  p.set('min_price', min)
      if (max)  p.set('max_price', max)
      window.location.href = pathPrefix() + 'pages/search.html?' + p.toString()
    }

    setMode('sale')
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', injectQuickSearch)
  else
    injectQuickSearch()
})()
