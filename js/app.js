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
  // Absolute root — works from any depth (e.g. /pages/guides/buying.html)
  // so the logo, dropdowns and account links never produce wrong URLs like
  // /pages/index.html or /pages/pages/guides/buying.html.
  const root = '/'

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
        <button class="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `

  // Inject mobile slide-out menu once per page load
  if (!document.getElementById('mobile-menu')) {
    var mm = document.createElement('div')
    mm.className = 'mobile-menu'
    mm.id = 'mobile-menu'
    mm.innerHTML =
      '<div class="mobile-menu-header">' +
        '<div class="mobile-menu-logo">mov<span style="color:#e07b3f">in</span></div>' +
        '<button class="mobile-menu-close" onclick="toggleMobileMenu()">✕</button>' +
      '</div>' +
      '<div class="mobile-menu-body">' +
        '<div class="mm-item" onclick="location.href=\'/pages/search.html?listing_type=sale\';toggleMobileMenu()"><div class="mm-icon">' + icon('house',18,'#1a5c45') + '</div>Buy a property</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/search.html?listing_type=rent\';toggleMobileMenu()"><div class="mm-icon">' + icon('apartment',18) + '</div>Rent a property</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/map-search.html\';toggleMobileMenu()"><div class="mm-icon">' + icon('map',18) + '</div>Map search</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/commercial.html\';toggleMobileMenu()"><div class="mm-icon">' + icon('house',18) + '</div>Commercial</div>' +
        '<div class="mm-divider"></div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/tools.html#mortgage\';toggleMobileMenu()"><div class="mm-icon">' + icon('calculator',18) + '</div>Mortgage calculator</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/tools.html#valuation\';toggleMobileMenu()"><div class="mm-icon">' + icon('house',18) + '</div>Home valuation</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/tools.html#stamp\';toggleMobileMenu()"><div class="mm-icon">' + icon('document',18) + '</div>Stamp duty</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/tools.html#ftb\';toggleMobileMenu()"><div class="mm-icon">' + icon('key',18) + '</div>First-time buyer</div>' +
        '<div class="mm-divider"></div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/list.html\';toggleMobileMenu()"><div class="mm-icon" style="background:#fdf0e6">' + icon('plus',18,'#e07b3f') + '</div>List your property</div>' +
        '<div class="mm-item" onclick="location.href=\'/pages/contact.html\';toggleMobileMenu()"><div class="mm-icon">' + icon('message',18) + '</div>Contact us</div>' +
      '</div>' +
      '<div class="mobile-menu-footer" id="mobile-menu-footer">' +
        (isLoggedIn
          ? '<a href="/pages/dashboard.html" class="btn btn-primary" style="flex:1;justify-content:center;padding:13px">My account</a>'
          : '<a href="/pages/login.html" class="btn btn-ghost" style="flex:1;justify-content:center;padding:13px">Sign in</a>' +
            '<a href="/pages/register.html" class="btn btn-primary" style="flex:1;justify-content:center;padding:13px">Register free</a>'
        ) +
      '</div>'
    document.body.insertBefore(mm, nav.nextSibling)
  }

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

function toggleMobileMenu() {
  var m = document.getElementById('mobile-menu')
  if (!m) return
  m.classList.toggle('open')
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : ''
}
window.toggleMobileMenu = toggleMobileMenu

// ── Hover-open dropdown menus on .nav-has-dropdown items ─────────────────
// Used by Buy / Rent dropdowns on every page. Re-runs after renderNav()
// rebuilds the nav, and also fires on first DOMContentLoaded so the inline
// nav on index.html gets it too.

// ────────────────────────────────────────────────────────────────────────────
//   SEO helpers
//   Every page should call setSEO({...}) once. It writes (or updates):
//     - <title>
//     - <meta name="description">
//     - <link rel="canonical">
//     - Open Graph + Twitter card meta tags
//     - JSON-LD blocks (Organization, WebSite, page-specific schema, breadcrumbs)
//   Idempotent — calling it twice replaces the existing tags rather than
//   appending duplicates.
// ────────────────────────────────────────────────────────────────────────────
window.MOVIN_ORIGIN = 'https://movin.ie'

function _seoUpsertMeta(attr, value, content){
  if (!content) return
  var el = document.head.querySelector('meta[' + attr + '="' + value + '"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
function _seoUpsertLink(rel, href){
  if (!href) return
  var el = document.head.querySelector('link[rel="' + rel + '"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
function _seoUpsertJsonLd(id, data){
  if (!data) return
  var el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  try { el.textContent = JSON.stringify(data) } catch(e){}
}

// Movin Organization JSON-LD — included on every page
function movinOrgSchema(){
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': window.MOVIN_ORIGIN + '/#organization',
    'name': 'Movin.ie',
    'url': window.MOVIN_ORIGIN + '/',
    'logo': window.MOVIN_ORIGIN + '/favicon.svg',
    'description': "Ireland's modern property marketplace. Buy, rent, share and list — your first listing is free.",
    'areaServed': { '@type': 'Country', 'name': 'Ireland' },
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'IE',
      'addressLocality': 'Dublin'
    },
    'sameAs': [
      'https://www.facebook.com/movin.ie',
      'https://www.instagram.com/movin.ie'
    ],
    'email': 'hello@movin.ie'
  }
}
// Movin WebSite JSON-LD — surfaces the search box in Google sitelinks
function movinWebsiteSchema(){
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': window.MOVIN_ORIGIN + '/#website',
    'url': window.MOVIN_ORIGIN + '/',
    'name': 'Movin.ie',
    'publisher': { '@id': window.MOVIN_ORIGIN + '/#organization' },
    'inLanguage': 'en-IE',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': window.MOVIN_ORIGIN + '/pages/search.html?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * setSEO({ title, description, canonical, image, type, schema, breadcrumbs })
 *
 * - title:        full <title> tag content (defaults to existing if omitted)
 * - description:  meta description and OG/Twitter description
 * - canonical:    canonical URL (defaults to current page URL minus query/hash)
 * - image:        absolute URL of the social-share image
 * - type:         OG type — 'website' | 'article' | 'product'
 * - schema:       additional page-specific JSON-LD object (e.g. FAQPage,
 *                 ItemList, ContactPage, RealEstateListing)
 * - breadcrumbs:  array of { name, url } items for BreadcrumbList
 */
function setSEO(opts){
  opts = opts || {}
  var origin = window.MOVIN_ORIGIN

  // Canonical defaults to current pathname (strip query + hash)
  var canon = opts.canonical
  if (!canon) {
    canon = origin + location.pathname.replace(/\/index\.html$/, '/')
  } else if (canon.indexOf('http') !== 0) {
    canon = origin + (canon.charAt(0) === '/' ? '' : '/') + canon
  }

  if (opts.title) document.title = opts.title

  _seoUpsertMeta('name',     'description',         opts.description || '')
  _seoUpsertLink('canonical', canon)

  // Open Graph
  var ogType = opts.type || 'website'
  var ogTitle = opts.title || document.title
  var ogDesc  = opts.description || ''
  var ogImg   = opts.image || (origin + '/favicon.svg')
  _seoUpsertMeta('property', 'og:type',         ogType)
  _seoUpsertMeta('property', 'og:title',        ogTitle)
  _seoUpsertMeta('property', 'og:description',  ogDesc)
  _seoUpsertMeta('property', 'og:url',          canon)
  _seoUpsertMeta('property', 'og:image',        ogImg)
  _seoUpsertMeta('property', 'og:site_name',    'Movin.ie')
  _seoUpsertMeta('property', 'og:locale',       'en_IE')

  // Twitter
  _seoUpsertMeta('name', 'twitter:card',        ogImg ? 'summary_large_image' : 'summary')
  _seoUpsertMeta('name', 'twitter:title',       ogTitle)
  _seoUpsertMeta('name', 'twitter:description', ogDesc)
  _seoUpsertMeta('name', 'twitter:image',       ogImg)

  // JSON-LD: Organization + WebSite always; page-specific schema; breadcrumbs
  _seoUpsertJsonLd('schema-org-org',     movinOrgSchema())
  _seoUpsertJsonLd('schema-org-website', movinWebsiteSchema())
  if (opts.schema)      _seoUpsertJsonLd('schema-org-page',        opts.schema)
  if (opts.breadcrumbs && opts.breadcrumbs.length) {
    _seoUpsertJsonLd('schema-org-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': opts.breadcrumbs.map(function(b, i){
        return {
          '@type': 'ListItem',
          'position': i + 1,
          'name': b.name,
          'item': b.url.indexOf('http') === 0 ? b.url : (origin + (b.url.charAt(0) === '/' ? '' : '/') + b.url)
        }
      })
    })
  }
}
window.setSEO = setSEO
window.movinOrgSchema = movinOrgSchema
window.movinWebsiteSchema = movinWebsiteSchema

// Inject the search-page styles inline so type-landing pages don't depend on
// the deployed main.css being up-to-date. Idempotent — only runs once per page.
function ensureTlpStyles(){
  if (document.getElementById('tlp-inline-styles')) return
  var s = document.createElement('style')
  s.id = 'tlp-inline-styles'
  s.textContent = ''
    + ':root{--g:#1a5c45;--gd:#0e3d2e;--gl:#e9f4ef;--o:#e07b3f;--border:#e8e4dc}'
    /* Sticky search top-bar */
    + '.sr-topbar{background:var(--white,#fff);border-bottom:1px solid var(--border);padding:1rem 1rem .85rem;position:sticky;top:0;z-index:50;box-shadow:0 2px 16px rgba(0,0,0,.07)}'
    + '.sr-search-row{display:flex;gap:8px;align-items:center;position:relative}'
    + '.sr-input{flex:1;min-width:0;border:2px solid var(--border);border-radius:50px;padding:13px 20px;font-size:14px;outline:none;background:#fafaf8;-webkit-appearance:none;font-family:inherit;transition:border .15s,background .15s,box-shadow .15s}'
    + '.sr-input:focus{border-color:var(--g);background:#fff;box-shadow:0 0 0 4px rgba(26,92,69,.08)}'
    + '.sr-search-btn{background:linear-gradient(135deg,var(--g),var(--gd));color:#fff;border:none;border-radius:50px;padding:13px 24px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:all .18s;box-shadow:0 6px 16px rgba(26,92,69,.25);display:inline-flex;align-items:center;gap:6px}'
    + '.sr-search-btn:hover{box-shadow:0 8px 22px rgba(26,92,69,.35);transform:translateY(-1px)}'
    + '.sr-search-btn:active{transform:scale(.97)}'
    + '.sr-search-btn svg{width:14px;height:14px;stroke:#fff;fill:none}'
    /* Page title row */
    + '.tlp-titlewrap{padding:1.25rem 1rem .25rem;max-width:1180px;margin:0 auto}'
    + '.tlp-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--g);letter-spacing:1.6px;text-transform:uppercase;font-weight:600;margin-bottom:.4rem}'
    + '.tlp-eyebrow::before{content:"";width:18px;height:2px;background:var(--g);border-radius:2px}'
    + '.tlp-title{font-family:"Playfair Display",serif;font-size:clamp(24px,3.5vw,32px);font-weight:900;color:var(--text,#111);letter-spacing:-.5px;margin:0;line-height:1.15}'
    + '.tlp-title em{font-style:normal;color:var(--g)}'
    + '.tlp-sub{font-size:14px;color:#888;font-weight:300;line-height:1.55;margin:.5rem 0 0;max-width:680px}'
    /* Filter pill row */
    + '.tlp-filter-row{display:flex;gap:6px;flex-wrap:wrap;padding:.75rem 1rem 1rem;max-width:1180px;margin:0 auto;align-items:center;border-bottom:1px solid var(--border)}'
    + '.tlp-filter-row .tlp-flabel{font-size:10px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.6px;margin-right:.25rem}'
    + '.qfc{display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--border);border-radius:50px;padding:8px 14px;font-size:13px;font-weight:500;background:var(--white,#fff);color:#555;cursor:pointer;font-family:inherit;-webkit-appearance:none;outline:none;transition:all .15s;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23aaa\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:30px;flex-shrink:0;text-decoration:none}'
    + '.qfc:hover{border-color:var(--g);color:var(--g)}'
    + '.qfc.has-value{background-color:var(--gl);border-color:var(--g);color:var(--g);font-weight:600}'
    + '.qfc-link{background-image:none !important;padding-right:14px;color:var(--g) !important;border-color:var(--g) !important;background-color:var(--gl) !important;font-weight:600}'
    + '.qfc-link:hover{background-color:var(--g) !important;color:#fff !important}'
    /* Sibling chips strip */
    + '.tlp-siblings{background:#f5f2ec;padding:.55rem 1rem;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}'
    + '.tlp-siblings::-webkit-scrollbar{display:none}'
    + '.tlp-sib{display:inline-flex;align-items:center;gap:6px;background:var(--white,#fff);border:1px solid var(--border);border-radius:50px;padding:7px 14px;font-size:12.5px;font-weight:500;color:#555;cursor:pointer;white-space:nowrap;text-decoration:none;flex-shrink:0;transition:all .15s}'
    + '.tlp-sib:hover{border-color:var(--g);color:var(--g);background:var(--gl);transform:translateY(-1px)}'
    + '.tlp-sib svg{width:13px;height:13px;color:var(--g);stroke:currentColor;fill:none;flex-shrink:0}'
    + '.tlp-sib:hover svg{color:var(--g)}'
    /* Results bar */
    + '.tlp-results-bar{display:flex;justify-content:space-between;align-items:center;padding:.85rem 1rem;background:#f5f2ec;border-bottom:1px solid var(--border);gap:.65rem;flex-wrap:wrap;max-width:1180px;margin:0 auto}'
    + '.tlp-results-count{font-size:13px;font-weight:500;color:#555}'
    + '.tlp-results-count strong{color:var(--g);font-weight:700;font-size:14px}'
    + '.tlp-sort{border:1.5px solid var(--border);border-radius:50px;padding:7px 14px;font-size:12px;background:var(--white,#fff);outline:none;font-family:inherit;-webkit-appearance:none;cursor:pointer;color:#555;font-weight:500}'
    /* Listings grid */
    + '.tlp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;padding:1rem;max-width:1180px;margin:0 auto}'
    + '@media(max-width:380px){.tlp-grid{grid-template-columns:1fr}}'
    + '@media(min-width:640px){.tlp-grid{grid-template-columns:repeat(2,1fr);gap:1rem;padding:1.25rem}}'
    + '@media(min-width:900px){.tlp-grid{grid-template-columns:repeat(3,1fr)}}'
    + '@media(min-width:1200px){.tlp-grid{grid-template-columns:repeat(4,1fr)}}'
    /* Skeleton card */
    + '@keyframes tlpShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}'
    + '.tlp-skel{background:var(--white,#fff);border:1px solid var(--border);border-radius:14px;overflow:hidden}'
    + '.tlp-skel-img{height:175px;background:linear-gradient(90deg,#ede9e1 0%,#f5f2ec 50%,#ede9e1 100%);background-size:800px 100%;animation:tlpShimmer 1.4s infinite linear}'
    + '.tlp-skel-body{padding:.85rem 1rem 1rem}'
    + '.tlp-skel-line{height:11px;border-radius:6px;background:linear-gradient(90deg,#ede9e1 0%,#f5f2ec 50%,#ede9e1 100%);background-size:800px 100%;animation:tlpShimmer 1.4s infinite linear;margin-bottom:8px}'
    + '.tlp-skel-line.sm{width:35%;height:9px}'
    + '.tlp-skel-line.lg{width:60%;height:18px}'
    + '.tlp-skel-line.md{width:80%}'
    /* Empty state */
    + '.tlp-empty{grid-column:1/-1;text-align:center;padding:3.5rem 1rem;background:var(--white,#fff);border:1px dashed var(--border);border-radius:18px}'
    + '.tlp-empty-ico{font-size:42px;margin-bottom:.85rem;opacity:.45}'
    + '.tlp-empty h3{font-family:"Playfair Display",serif;font-size:20px;color:var(--text,#111);margin-bottom:.5rem;font-weight:700}'
    + '.tlp-empty p{font-size:14px;color:#888;margin-bottom:1.5rem;font-weight:300;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.6}'
    + '.tlp-empty-cta{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}'
    + '.tlp-empty-cta a{padding:11px 22px;font-size:13.5px;border-radius:50px;text-decoration:none;font-weight:600;font-family:inherit;display:inline-flex;align-items:center;gap:6px;transition:all .18s}'
    + '.tlp-empty-cta a.primary{background:var(--g);color:#fff;box-shadow:0 6px 16px rgba(26,92,69,.25)}'
    + '.tlp-empty-cta a.primary:hover{background:var(--gd);box-shadow:0 8px 22px rgba(26,92,69,.35)}'
    + '.tlp-empty-cta a.ghost{background:transparent;color:var(--g);border:1.5px solid var(--g)}'
    + '.tlp-empty-cta a.ghost:hover{background:var(--gl)}'
    /* FAQ */
    + '.tlp-faq{max-width:880px;margin:0 auto;padding:2.5rem 1.25rem 4rem}'
    + '.tlp-faq h2{font-family:"Playfair Display",serif;font-size:24px;font-weight:900;color:var(--text,#111);margin-bottom:.35rem;letter-spacing:-.3px;line-height:1.15}'
    + '.tlp-faq-sub{font-size:13px;color:#888;font-weight:300;margin-bottom:1.5rem}'
    + '.tlp-faq-item{background:var(--white,#fff);border:1px solid var(--border);border-radius:14px;padding:1.1rem 1.4rem;margin-bottom:8px;transition:border-color .15s}'
    + '.tlp-faq-item:hover{border-color:#d0d0c5}'
    + '.tlp-faq-item summary{font-size:14.5px;font-weight:600;color:var(--text,#111);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:1rem}'
    + '.tlp-faq-item summary::-webkit-details-marker{display:none}'
    + '.tlp-faq-item summary::after{content:"+";color:var(--g);font-size:24px;font-weight:300;line-height:1;flex-shrink:0;transition:transform .2s}'
    + '.tlp-faq-item[open] summary::after{content:"−";transform:rotate(180deg)}'
    + '.tlp-faq-a{font-size:13.5px;color:#666;line-height:1.7;margin-top:.85rem;font-weight:300;padding-top:.85rem;border-top:1px solid #f5f2ec}'
    /* Bottom CTA banner */
    + '.tlp-bottom-cta{max-width:1180px;margin:1rem auto;padding:0 1rem}'
    + '.tlp-bottom-cta-card{background:linear-gradient(135deg,var(--g) 0%,var(--gd) 100%);color:#fff;border-radius:20px;padding:2rem 1.5rem;display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;box-shadow:0 12px 30px rgba(26,92,69,.18);position:relative;overflow:hidden}'
    + '.tlp-bottom-cta-card::before{content:"";position:absolute;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.06);top:-100px;right:-80px;pointer-events:none}'
    + '.tlp-bottom-cta-card h3{font-family:"Playfair Display",serif;font-size:22px;font-weight:900;margin-bottom:.35rem;line-height:1.15}'
    + '.tlp-bottom-cta-card p{font-size:13.5px;color:rgba(255,255,255,.78);font-weight:300;line-height:1.55;max-width:460px}'
    + '.tlp-bottom-cta-card a{flex-shrink:0;background:#fff;color:var(--g);padding:13px 24px;font-size:14px;font-weight:600;border-radius:50px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:transform .18s,box-shadow .18s;position:relative;z-index:1}'
    + '.tlp-bottom-cta-card a:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.18)}'
    /* Dark mode */
    + '[data-theme="dark"] .sr-topbar{background:#1a1a1a;border-color:#2a2a2a}'
    + '[data-theme="dark"] .sr-input{background:#0f0f0f;border-color:#2a2a2a;color:#e8e8e8}'
    + '[data-theme="dark"] .sr-input:focus{background:#1a1a1a;border-color:#2ecc8a}'
    + '[data-theme="dark"] .qfc{background:#1a1a1a;border-color:#2a2a2a;color:#aaa}'
    + '[data-theme="dark"] .qfc:hover,[data-theme="dark"] .qfc.has-value{color:#7ec9a8;border-color:#2ecc8a;background-color:#0d2e1e}'
    + '[data-theme="dark"] .tlp-siblings{background:#141414}'
    + '[data-theme="dark"] .tlp-sib{background:#1a1a1a;border-color:#2a2a2a;color:#aaa}'
    + '[data-theme="dark"] .tlp-sib:hover{background:#0d2e1e;color:#7ec9a8;border-color:#2ecc8a}'
    + '[data-theme="dark"] .tlp-results-bar{background:#141414;border-color:#2a2a2a}'
    + '[data-theme="dark"] .tlp-sort{background:#1a1a1a;border-color:#2a2a2a;color:#ccc}'
    + '[data-theme="dark"] .tlp-skel,[data-theme="dark"] .tlp-empty,[data-theme="dark"] .tlp-faq-item{background:#1a1a1a;border-color:#2a2a2a}'
    + '[data-theme="dark"] .tlp-skel-img,[data-theme="dark"] .tlp-skel-line{background:linear-gradient(90deg,#1f1f1f 0%,#2a2a2a 50%,#1f1f1f 100%);background-size:800px 100%}'
    + '[data-theme="dark"] .tlp-empty h3{color:#e8e8e8}'
    + '[data-theme="dark"] .tlp-faq-item summary{color:#e8e8e8}'
    + '[data-theme="dark"] .tlp-faq-a{color:#aaa;border-color:#2a2a2a}'
    + '[data-theme="dark"] .tlp-title{color:#e8e8e8}'
  document.head.appendChild(s)
}

// ── Property-type landing pages ──────────────────────────────────────────
// Each dedicated page (house-for-sale.html, apartment-for-rent.html, …) calls
// this with its config. Layout matches search.html — sticky topbar, pill
// filters, results header and listing grid — so users get a consistent UX
// across every entry point.
function renderTypeLanding(opts){
  ensureTlpStyles()
  var listingType  = opts.listingType    // 'sale' | 'rent' | 'share'
  var propertyType = opts.propertyType   // 'house' | 'apartment' | 'bungalow' | 'site' | ''
  var h1           = opts.h1
  var intro        = opts.intro
  var siblings     = opts.siblings || []
  var navActive    = opts.navActive
  var seoFaq       = opts.faq || null

  if (typeof renderNav === 'function') renderNav(navActive)

  // Absolute path so links resolve correctly from /pages/ AND /pages/guides/.
  // Every renderTypeLanding link points at a file inside /pages/, so this
  // root prefix simplifies the rest of the function.
  var root = '/pages/'

  // Skeleton card — matches the prop-card aspect ratio so layout doesn't jump
  var skel = '<div class="tlp-skel"><div class="tlp-skel-img"></div><div class="tlp-skel-body"><div class="tlp-skel-line sm"></div><div class="tlp-skel-line lg"></div><div class="tlp-skel-line md"></div></div></div>'

  // Sibling chip row — quick links to other residential types
  function sibLink(s){
    var ico = s.icon ? '<svg viewBox="0 0 24 24"><use href="/icons.svg#' + s.icon + '"/></svg>' : ''
    return '<a class="tlp-sib" href="' + s.href + '">' + ico + s.label + '</a>'
  }
  var siblingsHTML = siblings.map(sibLink).join('')

  // Eyebrow text per listing-type
  var eyebrow = listingType === 'sale' ? 'Buy a home'
              : listingType === 'rent' ? 'Rent a home'
              : 'Find a room'

  // Bottom CTA copy varies by listing type
  var bottomCta = listingType === 'sale'
    ? { h:'Selling instead?', p:'List your property in under 5 minutes — your first listing on Movin is completely free.', cta:'List your property →', href: root + 'list.html' }
    : listingType === 'rent'
    ? { h:'Letting your property?', p:'Reach renters across Ireland — flat-fee listings, no monthly contract, no surprise charges.', cta:'List a rental →', href: root + 'list.html' }
    : { h:'Got a room to share?', p:'List a single room in your home — perfect for splitting rent or making space for a flatmate.', cta:'List a room →', href: root + 'list.html' }

  // Build the page shell — search.html-style layout, fully self-contained
  var shellHTML =
    /* Sticky search topbar */
    '<div class="sr-topbar">' +
      '<div class="sr-search-row">' +
        '<input class="sr-input" id="tlp-q" type="text" autocomplete="off" placeholder="Filter by area, county or Eircode…" onkeydown="if(event.key===\'Enter\')tlpFetch()"/>' +
        '<button class="sr-search-btn" onclick="tlpFetch()">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
          'Search' +
        '</button>' +
      '</div>' +
    '</div>' +

    /* Page title section */
    '<div class="tlp-titlewrap">' +
      '<div class="tlp-eyebrow">' + eyebrow + '</div>' +
      '<h1 class="tlp-title">' + h1 + '</h1>' +
      (intro ? '<p class="tlp-sub">' + intro + '</p>' : '') +
    '</div>' +

    /* Filter pill row */
    '<div class="tlp-filter-row">' +
      '<span class="tlp-flabel">Filter</span>' +
      '<select class="qfc" id="tlp-county"><option value="">All counties</option></select>' +
      '<select class="qfc" id="tlp-beds">' +
        '<option value="">Any beds</option>' +
        '<option value="1">1+ bed</option>' +
        '<option value="2">2+ beds</option>' +
        '<option value="3">3+ beds</option>' +
        '<option value="4">4+ beds</option>' +
        '<option value="5">5+ beds</option>' +
      '</select>' +
      '<select class="qfc" id="tlp-min"></select>' +
      '<select class="qfc" id="tlp-max"></select>' +
      '<a class="qfc qfc-link" href="' + root + 'search.html?listing_type=' + listingType + (propertyType ? '&property_type=' + propertyType : '') + '">⚙ More filters</a>' +
    '</div>' +

    /* Sibling chips */
    (siblings.length ? '<div class="tlp-siblings">' + siblingsHTML + '</div>' : '') +

    /* Results bar */
    '<div class="tlp-results-bar">' +
      '<div class="tlp-results-count" id="tlp-count">Loading ' + h1.toLowerCase() + '…</div>' +
      '<select class="tlp-sort" id="tlp-sort" onchange="tlpRender()">' +
        '<option value="newest">Most recent</option>' +
        '<option value="price_asc">Price ↑</option>' +
        '<option value="price_desc">Price ↓</option>' +
      '</select>' +
    '</div>' +

    /* Listings grid */
    '<div id="tlp-grid" class="tlp-grid">' + Array(8).fill(skel).join('') + '</div>' +

    /* Bottom CTA */
    '<div class="tlp-bottom-cta">' +
      '<div class="tlp-bottom-cta-card">' +
        '<div>' +
          '<h3>' + bottomCta.h + '</h3>' +
          '<p>' + bottomCta.p + '</p>' +
        '</div>' +
        '<a href="' + bottomCta.href + '">' + bottomCta.cta + '</a>' +
      '</div>' +
    '</div>' +

    /* FAQ */
    (seoFaq && seoFaq.length
      ? '<section class="tlp-faq">' +
          '<h2>Frequently asked</h2>' +
          '<p class="tlp-faq-sub">Quick answers about ' + h1.toLowerCase() + '.</p>' +
          seoFaq.map(function(q){
            return '<details class="tlp-faq-item"><summary>' + q.q + '</summary><div class="tlp-faq-a">' + q.a + '</div></details>'
          }).join('') +
        '</section>'
      : '')

  // Mount
  var host = document.getElementById('type-page')
  if (!host) {
    host = document.createElement('div')
    host.id = 'type-page'
    document.body.appendChild(host)
  }
  host.innerHTML = shellHTML

  if (typeof renderFooter === 'function') setTimeout(renderFooter, 0)

  // Hydrate counties + price options
  var COUNTIES = ['Dublin','Cork','Galway','Limerick','Waterford','Kerry','Meath','Kildare','Wicklow','Wexford','Kilkenny','Clare','Tipperary','Donegal','Mayo','Sligo','Leitrim','Roscommon','Longford','Westmeath','Offaly','Laois','Carlow','Louth','Monaghan','Cavan']
  var cSel = document.getElementById('tlp-county')
  COUNTIES.forEach(function(c){ var o = document.createElement('option'); o.value = c; o.textContent = c; cSel.appendChild(o) })

  var minOpts, maxOpts
  if (listingType === 'sale') {
    minOpts = [['','Min price'],['100000','€100k'],['200000','€200k'],['300000','€300k'],['500000','€500k']]
    maxOpts = [['','Max price'],['200000','€200k'],['300000','€300k'],['500000','€500k'],['750000','€750k'],['1000000','€1m+']]
  } else if (listingType === 'share') {
    minOpts = [['','Min /mo'],['400','€400'],['500','€500'],['600','€600'],['800','€800']]
    maxOpts = [['','Max /mo'],['500','€500'],['700','€700'],['900','€900'],['1100','€1.1k'],['1500','€1.5k+']]
  } else {
    minOpts = [['','Min /mo'],['1000','€1k'],['1500','€1.5k'],['2000','€2k'],['2500','€2.5k']]
    maxOpts = [['','Max /mo'],['1500','€1.5k'],['2000','€2k'],['2500','€2.5k'],['3000','€3k'],['4000','€4k+']]
  }
  function fillSel(id, opts){
    var sel = document.getElementById(id); if (!sel) return
    sel.innerHTML = ''
    opts.forEach(function(o){ var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.appendChild(op) })
  }
  fillSel('tlp-min', minOpts)
  fillSel('tlp-max', maxOpts)

  // Pre-fill from URL if any
  var u = new URLSearchParams(location.search)
  if (u.get('county'))    cSel.value = u.get('county')
  if (u.get('bedrooms'))  document.getElementById('tlp-beds').value = u.get('bedrooms')
  if (u.get('min_price')) document.getElementById('tlp-min').value  = u.get('min_price')
  if (u.get('max_price')) document.getElementById('tlp-max').value  = u.get('max_price')
  if (u.get('q'))         document.getElementById('tlp-q').value    = u.get('q')

  // ── State + fetch / render ──────────────────────────────────────────────
  var ALL = []
  function tlpFetch(){
    var p = { listing_type: listingType, sort:'newest', limit: 60 }
    if (propertyType) p.property_type = propertyType
    var county = cSel.value
    var beds   = document.getElementById('tlp-beds').value
    var min    = document.getElementById('tlp-min').value
    var max    = document.getElementById('tlp-max').value
    var q      = document.getElementById('tlp-q').value.trim()
    if (county) p.county    = county
    if (beds)   p.bedrooms  = beds
    if (min)    p.min_price = min
    if (max)    p.max_price = max
    if (q && !county) p.q   = q

    document.getElementById('tlp-count').textContent = 'Loading ' + h1.toLowerCase() + '…'
    document.getElementById('tlp-grid').innerHTML = Array(8).fill(skel).join('')

    return window.API.listings.search(p).then(function(res){
      ALL = (res && res.listings) || []
      tlpRender()
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
      grid.innerHTML =
        '<div class="tlp-empty">' +
          '<div class="tlp-empty-ico">🔍</div>' +
          '<h3>No matches yet</h3>' +
          '<p>Try widening the filters above — or be the first to list. Your first listing on Movin is completely free.</p>' +
          '<div class="tlp-empty-cta">' +
            '<a class="primary" href="' + root + 'list.html">List a property</a>' +
            '<a class="ghost" href="' + root + 'search.html?listing_type=' + listingType + '">Browse all listings</a>' +
          '</div>' +
        '</div>'
      hdr.textContent = 'No matches'
      return
    }
    hdr.innerHTML = '<strong>' + rows.length + '</strong> propert' + (rows.length === 1 ? 'y' : 'ies') + ' found'
    grid.innerHTML = rows.map(function(l){
      try { return window.buildPropertyCard(l, []) } catch(e){ return '' }
    }).join('')
    // Mark filter chips that have a value so they show the active state
    ;['tlp-county','tlp-beds','tlp-min','tlp-max'].forEach(function(id){
      var el = document.getElementById(id); if (!el) return
      el.classList.toggle('has-value', !!el.value)
    })
  }
  window.tlpRender = tlpRender
  window.tlpFetch  = tlpFetch
  ;[cSel, document.getElementById('tlp-beds'), document.getElementById('tlp-min'), document.getElementById('tlp-max')].forEach(function(el){
    if (el) el.addEventListener('change', tlpFetch)
  })

  // ── SEO + Schema ─────────────────────────────────────────────────────────
  // FAQPage schema if the page has FAQ entries
  var pageSchema = null
  if (seoFaq && seoFaq.length) {
    pageSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': seoFaq.map(function(q){
        return {
          '@type': 'Question',
          'name': q.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': q.a }
        }
      })
    }
  }
  // Breadcrumb: Home → Buy/Rent → This page
  var modeLabel = listingType === 'sale' ? 'Buy'
                : listingType === 'rent' ? 'Rent'
                : 'Sharing'
  var modeUrl   = listingType === 'sale' ? '/pages/search.html?listing_type=sale'
                : listingType === 'rent' ? '/pages/search.html?listing_type=rent'
                : '/pages/sharing.html'
  var thisFile = location.pathname.split('/').pop() || ''
  var breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: modeLabel, url: modeUrl },
    { name: h1, url: '/pages/' + thisFile }
  ]

  if (typeof setSEO === 'function') {
    setSEO({
      title:       h1 + ' – Movin.ie',
      description: intro,
      type:        'website',
      schema:      pageSchema,
      breadcrumbs: breadcrumbs
    })
  } else {
    // Fallback if setSEO isn't loaded yet (shouldn't happen, but be safe)
    document.title = h1 + ' – Movin.ie'
    var md = document.querySelector('meta[name="description"]')
    if (md && intro) md.setAttribute('content', intro)
  }

  tlpFetch()
}
window.renderTypeLanding = renderTypeLanding

// ────────────────────────────────────────────────────────────────────────────
//   Guide pages (Buyer guide, Seller guide, Mortgage guide, BER, etc.)
//   Each guide page calls renderGuide({...}) once with its config:
//
//     {
//       eyebrow:    'For buyers',
//       h1:         'The complete buyer\'s guide to Irish property',
//       intro:      '…short summary…',
//       updated:    '2026-05-09',
//       sections:   [{ id, title, html }, …]   // one per H2 section
//       related:    [{ label, href, eyebrow }, …]
//       cta:        { h, p, label, href }
//       schema:     extra JSON-LD merged with the default Article schema
//     }
//
//   Renders: hero, TOC (sticky on desktop), article body with green/orange
//   callouts, related-guides grid, bottom CTA, full SEO + Article schema +
//   Breadcrumbs.
// ────────────────────────────────────────────────────────────────────────────
function ensureGuideStyles(){
  if (document.getElementById('guide-inline-styles')) return
  var s = document.createElement('style')
  s.id = 'guide-inline-styles'
  s.textContent = ''
    + ':root{--g:#1a5c45;--gd:#0e3d2e;--gl:#e9f4ef;--o:#e07b3f;--border:#e8e4dc}'
    /* Hero */
    + '.gd-hero{background:linear-gradient(160deg,#1a5c45 0%,#0e3d2e 100%);padding:3rem 1.25rem 4.25rem;position:relative;overflow:hidden}'
    + '.gd-hero::before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;background:rgba(255,255,255,.05);top:-200px;left:-180px;pointer-events:none}'
    + '.gd-hero::after{content:"";position:absolute;width:420px;height:420px;border-radius:50%;background:rgba(224,123,63,.10);bottom:-200px;right:-160px;pointer-events:none}'
    + '.gd-hero-inner{max-width:780px;margin:0 auto;position:relative;z-index:2}'
    + '.gd-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,.78);letter-spacing:1.6px;text-transform:uppercase;margin-bottom:1rem;background:rgba(255,255,255,.10);padding:6px 14px;border-radius:50px;backdrop-filter:blur(6px);font-weight:500}'
    + '.gd-h1{font-family:"Playfair Display",serif;font-size:clamp(28px,6vw,44px);font-weight:900;color:#fff;line-height:1.1;letter-spacing:-1px;margin-bottom:.75rem}'
    + '.gd-h1 em{font-style:normal;color:#e07b3f}'
    + '.gd-intro{font-size:16px;color:rgba(255,255,255,.78);font-weight:300;line-height:1.55;max-width:640px}'
    + '.gd-meta{display:flex;gap:.65rem;flex-wrap:wrap;align-items:center;margin-top:1.25rem;font-size:12px;color:rgba(255,255,255,.55)}'
    + '.gd-meta-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.08);padding:5px 11px;border-radius:50px;backdrop-filter:blur(8px)}'
    /* Two-column shell */
    + '.gd-shell{max-width:1080px;margin:0 auto;padding:2.25rem 1.25rem 3rem;display:grid;grid-template-columns:240px 1fr;gap:2.5rem}'
    + '@media(max-width:880px){.gd-shell{grid-template-columns:1fr;gap:0;padding:1.75rem 1rem}}'
    /* Side TOC */
    + '.gd-toc{position:sticky;top:80px;align-self:start}'
    + '@media(max-width:880px){.gd-toc{display:none}}'
    + '.gd-toc-title{font-size:11px;color:#888;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;margin-bottom:.85rem}'
    + '.gd-toc a{display:block;padding:.55rem .75rem;border-radius:10px;font-size:13px;color:#555;text-decoration:none;font-weight:500;transition:all .15s;border-left:3px solid transparent;margin-left:-3px;line-height:1.4}'
    + '.gd-toc a:hover{color:var(--g);background:var(--gl)}'
    + '.gd-toc a.on{color:var(--g);background:var(--gl);border-left-color:var(--g);font-weight:600}'
    /* Article */
    + '.gd-article{font-family:"DM Sans",sans-serif;color:#333;font-size:16px;line-height:1.75;max-width:720px}'
    + '.gd-article > section{margin-bottom:2.5rem;scroll-margin-top:80px}'
    + '.gd-article h2{font-family:"Playfair Display",serif;font-size:clamp(22px,3.2vw,28px);font-weight:900;color:var(--text,#111);letter-spacing:-.4px;margin-bottom:.85rem;line-height:1.2}'
    + '.gd-article h3{font-family:"Playfair Display",serif;font-size:18px;font-weight:700;color:var(--text,#111);margin:1.5rem 0 .5rem;line-height:1.25}'
    + '.gd-article p{margin-bottom:1.1rem;color:#444;font-weight:300}'
    + '.gd-article strong{color:var(--text,#111);font-weight:600}'
    + '.gd-article a{color:var(--g);text-decoration:underline;text-decoration-color:rgba(26,92,69,.3);text-underline-offset:3px;font-weight:500}'
    + '.gd-article a:hover{text-decoration-color:var(--g)}'
    + '.gd-article ul,.gd-article ol{margin:0 0 1.1rem;padding-left:1.5rem}'
    + '.gd-article ul li,.gd-article ol li{margin-bottom:.55rem;color:#444;font-weight:300}'
    + '.gd-article ul li::marker{color:var(--g)}'
    + '.gd-article code{background:#f5f2ec;padding:1px 6px;border-radius:4px;font-size:.92em;color:#5a4a2c}'
    + '.gd-article hr{border:none;border-top:1px solid var(--border);margin:1.75rem 0}'
    /* Callouts */
    + '.gd-tip,.gd-note,.gd-warn{margin:1.25rem 0;padding:1rem 1.25rem;border-radius:14px;display:flex;gap:.85rem;align-items:flex-start;font-size:14.5px;line-height:1.6;font-weight:300}'
    + '.gd-tip{background:var(--gl);border-left:4px solid var(--g)}'
    + '.gd-tip strong,.gd-note strong,.gd-warn strong{font-weight:700}'
    + '.gd-note{background:#e8f0fd;border-left:4px solid #1d62cf;color:#163d6e}'
    + '.gd-note strong{color:#0d2960}'
    + '.gd-warn{background:#fdf0e6;border-left:4px solid var(--o);color:#8a3d10}'
    + '.gd-warn strong{color:#5e2705}'
    + '.gd-callout-ico{width:24px;height:24px;flex-shrink:0;margin-top:1px}'
    + '.gd-callout-ico svg{width:24px;height:24px;stroke:currentColor;fill:none}'
    /* Numbered/big list (e.g. step-by-step) */
    + '.gd-steps{counter-reset:gd 0;padding:0;margin:1.25rem 0;list-style:none}'
    + '.gd-steps > li{counter-increment:gd;position:relative;padding:.85rem 1.15rem .85rem 3rem;background:#fafaf6;border:1px solid var(--border);border-radius:12px;margin-bottom:.55rem;font-weight:300;color:#444}'
    + '.gd-steps > li::before{content:counter(gd);position:absolute;left:.85rem;top:.95rem;width:26px;height:26px;border-radius:50%;background:var(--g);color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;font-family:"DM Sans",sans-serif}'
    /* Tables */
    + '.gd-article table{width:100%;border-collapse:collapse;margin:1.25rem 0;font-size:14px}'
    + '.gd-article table th,.gd-article table td{padding:.7rem .9rem;text-align:left;border-bottom:1px solid var(--border)}'
    + '.gd-article table th{background:#fafaf6;font-weight:600;color:var(--text,#111);font-size:12px;text-transform:uppercase;letter-spacing:.4px}'
    + '.gd-article table tr:hover td{background:var(--gl)}'
    /* Related grid */
    + '.gd-related{margin-top:3rem}'
    + '.gd-related h2{font-family:"Playfair Display",serif;font-size:22px;font-weight:900;color:var(--text,#111);margin-bottom:1rem}'
    + '.gd-related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:.75rem}'
    + '.gd-related-card{display:block;background:var(--white,#fff);border:1px solid var(--border);border-radius:14px;padding:1rem 1.15rem;text-decoration:none;color:inherit;transition:all .18s}'
    + '.gd-related-card:hover{border-color:var(--g);transform:translateY(-2px);box-shadow:0 10px 24px rgba(26,92,69,.10)}'
    + '.gd-related-eyebrow{font-size:10px;color:var(--g);letter-spacing:1.2px;text-transform:uppercase;font-weight:600;margin-bottom:5px}'
    + '.gd-related-card-title{font-family:"Playfair Display",serif;font-size:15px;font-weight:700;color:var(--text,#111);line-height:1.25}'
    /* Bottom CTA */
    + '.gd-cta{background:linear-gradient(135deg,#1a5c45 0%,#0e3d2e 100%);color:#fff;border-radius:20px;padding:2rem 1.5rem;display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;box-shadow:0 12px 30px rgba(26,92,69,.18);position:relative;overflow:hidden;margin-top:3rem}'
    + '.gd-cta::before{content:"";position:absolute;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.06);top:-100px;right:-80px;pointer-events:none}'
    + '.gd-cta h3{font-family:"Playfair Display",serif;font-size:22px;font-weight:900;margin-bottom:.35rem;line-height:1.15}'
    + '.gd-cta p{font-size:13.5px;color:rgba(255,255,255,.78);font-weight:300;line-height:1.55;max-width:460px}'
    + '.gd-cta a{flex-shrink:0;background:#fff;color:var(--g);padding:13px 24px;font-size:14px;font-weight:600;border-radius:50px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:transform .18s,box-shadow .18s;position:relative;z-index:1}'
    + '.gd-cta a:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.18)}'
    /* Disclaimer */
    + '.gd-disclaimer{max-width:720px;margin:2rem 0 0;padding:1rem 1.15rem;background:#fafaf6;border:1px solid var(--border);border-radius:12px;font-size:12px;color:#888;line-height:1.6;font-weight:300}'
    + '.gd-disclaimer strong{color:#666;font-weight:600}'
    /* Dark mode */
    + '[data-theme="dark"] .gd-article{color:#ccc}'
    + '[data-theme="dark"] .gd-article p,[data-theme="dark"] .gd-article ul li,[data-theme="dark"] .gd-article ol li{color:#bbb}'
    + '[data-theme="dark"] .gd-article h2,[data-theme="dark"] .gd-article h3{color:#e8e8e8}'
    + '[data-theme="dark"] .gd-article strong{color:#fff}'
    + '[data-theme="dark"] .gd-article code{background:#252525;color:#f0d9a4}'
    + '[data-theme="dark"] .gd-article hr{border-color:#2a2a2a}'
    + '[data-theme="dark"] .gd-tip{background:#0d2e1e}'
    + '[data-theme="dark"] .gd-note{background:#0c1a30;color:#7eaeed}'
    + '[data-theme="dark"] .gd-warn{background:#2e1a0d;color:#f0a06d}'
    + '[data-theme="dark"] .gd-toc a{color:#aaa}'
    + '[data-theme="dark"] .gd-toc a:hover,[data-theme="dark"] .gd-toc a.on{background:#0d2e1e;color:#7ec9a8}'
    + '[data-theme="dark"] .gd-steps > li{background:#1a1a1a;border-color:#2a2a2a}'
    + '[data-theme="dark"] .gd-article table th{background:#1a1a1a;color:#e8e8e8}'
    + '[data-theme="dark"] .gd-article table td{border-color:#2a2a2a}'
    + '[data-theme="dark"] .gd-article table tr:hover td{background:#0d2e1e}'
    + '[data-theme="dark"] .gd-related-card{background:#1a1a1a;border-color:#2a2a2a}'
    + '[data-theme="dark"] .gd-related-card-title{color:#e8e8e8}'
    + '[data-theme="dark"] .gd-disclaimer{background:#1a1a1a;border-color:#2a2a2a;color:#888}'
  document.head.appendChild(s)
}

function renderGuide(opts){
  ensureGuideStyles()
  opts = opts || {}
  var sections = opts.sections || []
  var related  = opts.related  || []
  var cta      = opts.cta      || null

  // Absolute path so links resolve correctly from /pages/ AND /pages/guides/.
  var root = '/pages/'

  // Hero
  var heroHTML =
    '<section class="gd-hero">' +
      '<div class="gd-hero-inner">' +
        (opts.eyebrow ? '<div class="gd-eyebrow">' + opts.eyebrow + '</div>' : '') +
        '<h1 class="gd-h1">' + (opts.h1 || '') + '</h1>' +
        (opts.intro ? '<p class="gd-intro">' + opts.intro + '</p>' : '') +
        '<div class="gd-meta">' +
          (opts.updated ? '<span class="gd-meta-pill">📅 Updated ' + opts.updated + '</span>' : '') +
          (opts.readTime ? '<span class="gd-meta-pill">⏱ ' + opts.readTime + '</span>' : '') +
          '<span class="gd-meta-pill">🇮🇪 For Ireland</span>' +
        '</div>' +
      '</div>' +
    '</section>'

  // TOC
  var tocHTML =
    '<aside class="gd-toc">' +
      '<div class="gd-toc-title">In this guide</div>' +
      sections.map(function(s, i){
        return '<a href="#' + s.id + '" data-toc="' + s.id + '"' + (i===0 ? ' class="on"' : '') + '>' + s.title + '</a>'
      }).join('') +
    '</aside>'

  // Article
  var articleHTML =
    '<article class="gd-article">' +
      sections.map(function(s){
        return '<section id="' + s.id + '"><h2>' + s.title + '</h2>' + s.html + '</section>'
      }).join('') +
      (related.length
        ? '<section class="gd-related"><h2>Related guides</h2><div class="gd-related-grid">' +
            related.map(function(r){
              return '<a class="gd-related-card" href="' + r.href + '">' +
                       (r.eyebrow ? '<div class="gd-related-eyebrow">' + r.eyebrow + '</div>' : '') +
                       '<div class="gd-related-card-title">' + r.label + '</div>' +
                     '</a>'
            }).join('') +
          '</div></section>'
        : '') +
      (cta
        ? '<div class="gd-cta">' +
            '<div><h3>' + cta.h + '</h3><p>' + cta.p + '</p></div>' +
            '<a href="' + cta.href + '">' + cta.label + ' →</a>' +
          '</div>'
        : '') +
      '<div class="gd-disclaimer"><strong>Heads-up:</strong> This guide is for general information only and is not legal, financial or tax advice. Irish property law and lender criteria can change. Always confirm specifics with a qualified solicitor, mortgage broker, accountant or the relevant authority before making decisions.</div>' +
    '</article>'

  // Mount
  var host = document.getElementById('guide-page')
  if (!host) {
    host = document.createElement('div')
    host.id = 'guide-page'
    document.body.appendChild(host)
  }
  host.innerHTML = heroHTML + '<div class="gd-shell">' + tocHTML + articleHTML + '</div>'

  if (typeof renderFooter === 'function') setTimeout(renderFooter, 0)

  // Active TOC item on scroll
  var headings = sections.map(function(s){ return document.getElementById(s.id) })
  function setActiveToc(id){
    document.querySelectorAll('.gd-toc a').forEach(function(a){ a.classList.toggle('on', a.dataset.toc === id) })
  }
  function onScroll(){
    var fromTop = window.scrollY + 120
    for (var i = headings.length - 1; i >= 0; i--){
      var el = headings[i]
      if (el && el.offsetTop <= fromTop) { setActiveToc(el.id); return }
    }
    if (sections[0]) setActiveToc(sections[0].id)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // SEO + schema
  var articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': opts.h1,
    'description': opts.intro,
    'datePublished': opts.published || opts.updated,
    'dateModified': opts.updated,
    'author': { '@type': 'Organization', '@id': 'https://movin.ie/#organization' },
    'publisher': { '@id': 'https://movin.ie/#organization' },
    'inLanguage': 'en-IE',
    'about': { '@id': 'https://movin.ie/#organization' }
  }
  if (opts.schema) {
    Object.keys(opts.schema).forEach(function(k){ articleSchema[k] = opts.schema[k] })
  }
  if (typeof setSEO === 'function') {
    setSEO({
      title:       opts.h1 + ' – Movin.ie',
      description: opts.intro,
      type:        'article',
      schema:      articleSchema,
      breadcrumbs: opts.breadcrumbs || [
        { name: 'Home',      url: '/' },
        { name: 'Resources', url: '/pages/faq.html' },
        { name: opts.h1,     url: location.pathname }
      ]
    })
  }
}
window.renderGuide = renderGuide

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
  // Absolute path — listing.html and neighbourhood.html always live under /pages/
  const root = '/pages/'
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
  // Absolute root — works from any depth (e.g. /pages/guides/buying.html) so
  // every footer link resolves correctly without `../../` gymnastics.
  var root = '/'
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
          '<div class="footer-col-title">Buy</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/house-for-sale.html">Houses for sale</a>' +
            '<a href="' + root + 'pages/apartment-for-sale.html">Apartments for sale</a>' +
            '<a href="' + root + 'pages/bungalow-for-sale.html">Bungalows for sale</a>' +
            '<a href="' + root + 'pages/site-for-sale.html">Sites &amp; Land</a>' +
            '<a href="' + root + 'pages/search.html?listing_type=sale">All properties for sale</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Rent</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/house-for-rent.html">Houses to rent</a>' +
            '<a href="' + root + 'pages/apartment-for-rent.html">Apartments to rent</a>' +
            '<a href="' + root + 'pages/bungalow-for-rent.html">Bungalows to rent</a>' +
            '<a href="' + root + 'pages/sharing.html">Sharing &amp; rooms</a>' +
            '<a href="' + root + 'pages/search.html?listing_type=rent">All rentals</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Tools</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/drive-time.html">Find by drive time</a>' +
            '<a href="' + root + 'pages/map-search.html">Map search</a>' +
            '<a href="' + root + 'pages/latest.html">Latest listings</a>' +
            '<a href="' + root + 'pages/tools.html#mortgage">Mortgage calculator</a>' +
            '<a href="' + root + 'pages/tools.html#valuation">Home valuation</a>' +
            '<a href="' + root + 'pages/tools.html#stamp">Stamp duty calculator</a>' +
            '<a href="' + root + 'pages/tools.html#ftb">First-time buyer</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Resources</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/guides/buying.html">Buyer guides</a>' +
            '<a href="' + root + 'pages/guides/selling.html">Seller guides</a>' +
            '<a href="' + root + 'pages/guides/renting.html">Renter guides</a>' +
            '<a href="' + root + 'pages/guides/landlords.html">Landlord guides</a>' +
            '<a href="' + root + 'pages/guides/mortgage.html">Mortgage guides</a>' +
            '<a href="' + root + 'pages/guides/mortgage-in-principle.html">Mortgage in Principle</a>' +
            '<a href="' + root + 'pages/guides/energy-efficiency.html">Energy efficiency &amp; BER</a>' +
            '<a href="' + root + 'pages/guides/removals.html">Removals</a>' +
            '<a href="' + root + 'pages/house-price-index.html">House Price Index</a>' +
            '<a href="' + root + 'pages/guides/property-news.html">Property news</a>' +
            '<a href="' + root + 'pages/faq.html">Help &amp; FAQ</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-col-title">Company</div>' +
          '<div class="footer-links">' +
            '<a href="' + root + 'pages/about.html">About us</a>' +
            '<a href="' + root + 'pages/list.html">List your property</a>' +
            '<a href="' + root + 'pages/commercial.html">Commercial property</a>' +
            '<a href="' + root + 'pages/sold.html">Sold &amp; let prices</a>' +
            '<a href="' + root + 'pages/faq.html">Help &amp; FAQ</a>' +
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
      var root = '/pages/'   // absolute — listing.html lives under /pages/
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
      var root = '/pages/'   // absolute — listing.html lives under /pages/
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
    var a = activeTab()
    function cls(name) { return 'tab-item' + (a === name ? ' active' : '') }
    return '' +
      '<nav class="tab-bar" role="navigation" aria-label="Primary">' +
        '<a class="' + cls('home') + '" href="/index.html" aria-label="Home">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-home"/></svg></span>Home' +
        '</a>' +
        '<a class="' + cls('search') + '" href="/pages/search.html" aria-label="Search">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-search"/></svg></span>Search' +
        '</a>' +
        '<a class="tab-list-item" href="/pages/list.html" aria-label="List your property">' +
          '<span class="tab-list-circle"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-plus"/></svg></span>' +
          '<span class="tab-list-label">List</span>' +
        '</a>' +
        '<a class="' + cls('map') + '" href="/pages/map-search.html" aria-label="Map">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-map"/></svg></span>Map' +
        '</a>' +
        '<a class="' + cls('account') + '" href="/pages/dashboard.html" aria-label="Account">' +
          '<span class="tab-icon-wrap"><svg width="22" height="22" aria-hidden="true"><use href="/icons.svg#icon-user"/></svg></span>Account' +
        '</a>' +
      '</nav>'
  }

  function goBack() {
    try {
      var sameOrigin = document.referrer && new URL(document.referrer, location.href).origin === location.origin
      if (history.length > 1 && sameOrigin) { history.back(); return }
    } catch(e) {}
    location.href = '/index.html'
  }
  window.movinGoBack = goBack

  // Inject the tab bar styles inline so the bar always works, even if the
  // deployed main.css is stale or aggressively cached. Idempotent.
  function ensureTabBarStyles(){
    if (document.getElementById('tab-bar-inline-styles')) return
    var s = document.createElement('style')
    s.id = 'tab-bar-inline-styles'
    s.textContent = ''
      // ── Floating liquid-glass pill (very translucent, elevated) ──────────
      + '.tab-bar{'
      +   'position:fixed !important;'
      +   'left:14px;right:14px;'
      +   'bottom:calc(16px + env(safe-area-inset-bottom,0px));'
      +   'height:64px;'
      +   'border-radius:999px;'
      +   'background:rgba(255,255,255,.28);'
      +   '-webkit-backdrop-filter:blur(50px) saturate(220%);'
      +   'backdrop-filter:blur(50px) saturate(220%);'
      +   'display:flex !important;align-items:center;'
      +   'padding:6px;gap:2px;'
      +   'z-index:1000;'
      +   'box-shadow:0 22px 50px rgba(0,0,0,.18), 0 8px 18px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04), inset 0 0 0 1px rgba(255,255,255,.55), inset 0 1px 0 rgba(255,255,255,.7);'
      +   'font-family:"DM Sans",sans-serif;'
      +   'overflow:visible;'
      + '}'
      + '@supports not ((-webkit-backdrop-filter:blur(1px)) or (backdrop-filter:blur(1px))){.tab-bar{background:rgba(255,255,255,.88)}}'
      // Each tab: icon + label, full pill background when active
      + '.tab-item,.tab-list-item{'
      +   'flex:1;height:52px;display:flex;flex-direction:column;'
      +   'align-items:center;justify-content:center;gap:3px;'
      +   'border:none;background:transparent;'
      +   'color:#1a1a1a;font-size:10.5px;font-weight:500;'
      +   'border-radius:999px;'
      +   '-webkit-tap-highlight-color:transparent;text-decoration:none;'
      +   'transition:background .22s ease,color .22s ease,transform .15s ease;'
      +   'font-family:inherit;cursor:pointer;'
      + '}'
      + '.tab-item:active,.tab-list-item:active{transform:scale(.95)}'
      + '.tab-item.active{background:rgba(0,0,0,.06);color:#1a5c45}'
      + '.tab-icon-wrap{width:26px;height:22px;display:flex;align-items:center;justify-content:center}'
      + '.tab-icon-wrap svg{width:22px;height:22px;stroke:currentColor;fill:none}'
      // ── Eye-catching elevated List FAB ────────────────────────────────
      + '.tab-list-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;background:transparent !important}'
      + '.tab-list-item .tab-list-circle{'
      +   'width:54px;height:54px;margin-top:-28px;'
      +   'display:flex;align-items:center;justify-content:center;'
      +   'background:linear-gradient(135deg,#f59045 0%,#e07b3f 45%,#c45b1f 100%);'
      +   'border-radius:50%;border:3px solid rgba(255,255,255,.96);'
      +   'box-shadow:0 10px 26px rgba(224,123,63,.50), 0 4px 10px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.35);'
      +   'transition:transform .22s cubic-bezier(.2,.7,.2,1), box-shadow .22s ease;'
      +   'position:relative;z-index:2;'
      + '}'
      + '.tab-list-item .tab-list-circle::before{'
      +   'content:"";position:absolute;inset:-4px;border-radius:50%;'
      +   'border:2px solid rgba(224,123,63,.55);'
      +   'animation:tabListPulse 2.4s cubic-bezier(.4,0,.6,1) infinite;'
      +   'pointer-events:none;z-index:1;'
      + '}'
      + '@keyframes tabListPulse{0%{transform:scale(.92);opacity:.9}70%{transform:scale(1.45);opacity:0}100%{transform:scale(1.5);opacity:0}}'
      + '.tab-list-item:hover .tab-list-circle{transform:translateY(-2px) scale(1.04);box-shadow:0 14px 32px rgba(224,123,63,.55), 0 6px 14px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.35)}'
      + '.tab-list-item:active .tab-list-circle{transform:scale(.94);box-shadow:0 5px 14px rgba(224,123,63,.45), 0 2px 6px rgba(0,0,0,.08)}'
      + '.tab-list-item .tab-list-circle svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2.8;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18))}'
      + '.tab-list-item .tab-list-label{font-size:10px;font-weight:600;letter-spacing:.2px;color:#c45b1f;margin-top:-2px}'
      + '@media(prefers-reduced-motion:reduce){.tab-list-item .tab-list-circle::before{animation:none;opacity:0}}'
      // Hide on tablet/desktop
      + '@media(min-width:768px){.tab-bar{display:none !important}}'
      // Body padding + lift other fixed UI above the floating pill
      + '@media(max-width:767px){'
      +   'body.has-tab-bar{padding-bottom:calc(86px + env(safe-area-inset-bottom,0px))}'
      +   'body.has-tab-bar .mobile-tabs{bottom:calc(82px + env(safe-area-inset-bottom,0px)) !important;padding-bottom:0 !important}'
      +   'body.has-tab-bar #compare-bar{bottom:calc(82px + env(safe-area-inset-bottom,0px)) !important}'
      +   'body.has-tab-bar #map{bottom:calc(82px + env(safe-area-inset-bottom,0px)) !important}'
      +   'body.has-tab-bar .card-panel{bottom:calc(82px + env(safe-area-inset-bottom,0px)) !important}'
      +   'body.has-tab-bar .scroll-top-btn{bottom:calc(110px + env(safe-area-inset-bottom,0px)) !important}'
      + '}'
      // Dark mode (translucent + heavy blur, like iOS App Store dark)
      + '[data-theme="dark"] .tab-bar{'
      +   'background:rgba(28,28,30,.45);'
      +   'box-shadow:0 14px 40px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.10), inset 0 1px 0 rgba(255,255,255,.06)'
      + '}'
      + '[data-theme="dark"] .tab-item{color:#ebebf5}'
      + '[data-theme="dark"] .tab-item.active{background:rgba(255,255,255,.08);color:#2ecc8a}'
      + '[data-theme="dark"] .tab-list-item .tab-list-label{color:#ebebf5}'
      + '@media(prefers-color-scheme:dark){'
      +   ':root:not([data-theme="light"]) .tab-bar{background:rgba(28,28,30,.45);box-shadow:0 14px 40px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.10), inset 0 1px 0 rgba(255,255,255,.06)}'
      +   ':root:not([data-theme="light"]) .tab-item{color:#ebebf5}'
      +   ':root:not([data-theme="light"]) .tab-item.active{background:rgba(255,255,255,.08);color:#2ecc8a}'
      +   ':root:not([data-theme="light"]) .tab-list-item .tab-list-label{color:#ebebf5}'
      + '}'
    document.head.appendChild(s)
  }

  function injectTabBar() {
    ensureTabBarStyles()
    if (document.querySelector('.tab-bar')) {
      // Existing tab bar — just mark body so padding-bottom kicks in
      document.body.classList.add('has-tab-bar')
      bindActiveTabScrollToTop()
      return
    }
    document.body.insertAdjacentHTML('beforeend', buildTabBarHTML())
    document.body.classList.add('has-tab-bar')
    bindActiveTabScrollToTop()
  }

  // iOS-style: tapping the already-active tab smooth-scrolls back to top.
  // (App Store does this on every tab.) For inactive tabs the link follows
  // its href as normal.
  function bindActiveTabScrollToTop() {
    var bar = document.querySelector('.tab-bar')
    if (!bar) return
    bar.querySelectorAll('.tab-item.active').forEach(function(el){
      if (el.dataset.scrollTopBound === '1') return
      el.dataset.scrollTopBound = '1'
      el.addEventListener('click', function(e){
        // Only intercept if this tab points to the page we're already on
        var href = el.getAttribute('href') || ''
        var hrefPath = href.split('?')[0].split('#')[0]
        var here = location.pathname
        var samePage = (hrefPath === here) ||
                       (hrefPath === '/index.html' && (here === '/' || here === ''))
        if (!samePage) return
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
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
      window.location.href = '/pages/search.html?' + p.toString()
    }

    setMode('sale')
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', injectQuickSearch)
  else
    injectQuickSearch()
})()
