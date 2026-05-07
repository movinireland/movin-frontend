// sw.js — Movin.ie Service Worker (Push Notifications)
// Place this file in the ROOT folder of your frontend repo

const CACHE = 'movin-v1'

// ── Install & cache key assets ────────────────────────────────────────────────
self.addEventListener('install', function(e) {
  self.skipWaiting()
})

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim())
})

// ── Push event — show notification ───────────────────────────────────────────
self.addEventListener('push', function(e) {
  var data = {}
  try { data = e.data.json() } catch(err) { data = { title: 'Movin.ie', body: e.data ? e.data.text() : 'New notification' } }

  var title   = data.title || 'Movin.ie'
  var options = {
    body:    data.body || 'You have a new notification',
    icon:    '/icons/favicon-192x192.png',
    badge:   '/icons/favicon-48x48.png',
    vibrate: [200, 100, 200],
    tag:     data.tag || 'movin-notification',
    data:    { url: data.url || '/pages/dashboard.html' },
    actions: data.actions || []
  }

  e.waitUntil(self.registration.showNotification(title, options))
})

// ── Notification click — open the right page ─────────────────────────────────
self.addEventListener('notificationclick', function(e) {
  e.notification.close()
  var url = (e.notification.data && e.notification.data.url) ? e.notification.data.url : '/pages/dashboard.html'

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes('movin.ie') && 'focus' in list[i]) {
          list[i].navigate(url)
          return list[i].focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
