// movin.ie icon system
// Usage: icon('home') or icon('home', 24, '#1a5c45')
// Drop icons.svg in your root folder and include this script

window.MOVIN_ICONS = {
  // Navigation
  'home':          'icon-home',
  'search':        'icon-search',
  'location':      'icon-location',
  'map':           'icon-map',
  'back':          'icon-back',
  'filter':        'icon-filter',
  'menu':          'icon-menu',
  'close':         'icon-close',
  'chevron-down':  'icon-chevron-down',
  'chevron-right': 'icon-chevron-right',
  // Property types
  'house':         'icon-house',
  'apartment':     'icon-apartment',
  'bungalow':      'icon-bungalow',
  'site':          'icon-site',
  // Specs
  'bed':           'icon-bed',
  'bath':          'icon-bath',
  'size':          'icon-size',
  'ber':           'icon-ber',
  // Actions
  'heart':         'icon-heart',
  'heart-filled':  'icon-heart-filled',
  'share':         'icon-share',
  'message':       'icon-message',
  'phone':         'icon-phone',
  'plus':          'icon-plus',
  'trash':         'icon-trash',
  'edit':          'icon-edit',
  // Dashboard
  'user':          'icon-user',
  'inbox':         'icon-inbox',
  'chart':         'icon-chart',
  'eye':           'icon-eye',
  'settings':      'icon-settings',
  'signout':       'icon-signout',
  'bell':          'icon-bell',
  // Features
  'garden':        'icon-garden',
  'garage':        'icon-garage',
  'alarm':         'icon-alarm',
  'wheelchair':    'icon-wheelchair',
  'pets':          'icon-pets',
  'sofa':          'icon-sofa',
  // Payments & tools
  'euro':          'icon-euro',
  'card':          'icon-card',
  'calculator':    'icon-calculator',
  'document':      'icon-document',
  'key':           'icon-key',
  'camera':        'icon-camera',
  'upload':        'icon-upload',
  'approve':       'icon-approve',
  'reject':        'icon-reject',
  'star':          'icon-star',
  'parking':       'icon-parking',
  'new-dev':       'icon-new-dev',
}

// Generate icon HTML
// icon('home') → <svg>...</svg>
// icon('home', 20) → 20x20px
// icon('home', 20, '#e07b3f') → orange
function icon(name, size, color) {
  size  = size  || 24
  color = color || 'currentColor'
  var id = window.MOVIN_ICONS[name]
  if (!id) {
    console.warn('movin icon not found:', name)
    return ''
  }
  return '<svg width="' + size + '" height="' + size + '" style="color:' + color + ';flex-shrink:0;display:inline-block;vertical-align:middle" aria-hidden="true"><use href="/icons.svg#' + id + '"/></svg>'
}

// Icon with label (for feature chips, nav items etc)
// iconLabel('bed', '3 beds') → icon + span
function iconLabel(name, label, size, color) {
  return '<span style="display:inline-flex;align-items:center;gap:5px">' +
    icon(name, size || 16, color || 'currentColor') +
    '<span>' + label + '</span>' +
  '</span>'
}

// Icon button (for save, share etc)
// iconBtn('heart', 'Save', 'handleSave()')
function iconBtn(name, label, onclick, size, color) {
  return '<button onclick="' + onclick + '" title="' + label + '" style="background:none;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:6px;color:inherit;font-family:inherit;font-size:inherit">' +
    icon(name, size || 20, color || 'currentColor') +
    (label ? '<span>' + label + '</span>' : '') +
  '</button>'
}

// Inject icons.svg sprite into the page (call once on page load)
function loadIconSprite() {
  if (document.getElementById('movin-icon-sprite')) return
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/icons.svg', true)
  xhr.onload = function() {
    if (xhr.status === 200) {
      var div = document.createElement('div')
      div.id = 'movin-icon-sprite'
      div.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
      div.innerHTML = xhr.responseText
      document.body.insertBefore(div, document.body.firstChild)
    }
  }
  xhr.send()
}

// Auto-load sprite when script runs
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadIconSprite)
} else {
  loadIconSprite()
}
