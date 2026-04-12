'use strict';

const CACHE     = 'neonav-v2';
const STATIC_RE = /^\/_next\/static\//;

// ── Install: cache minimal app shell ─────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(['/manifest.json', '/favicon.ico']))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches, take control ─────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache strategy for Next.js ────────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Pass through cross-origin requests (API calls, etc.)
  if (url.origin !== self.location.origin) return;

  if (STATIC_RE.test(url.pathname)) {
    // /_next/static/ assets have content hashes — cache-first, indefinitely
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
          return res;
        });
      })
    );
  } else {
    // HTML and other same-origin assets — network-first, cache as offline fallback
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});

// ── Page open/closed tracking ─────────────────────────────────────────────────
let pageOpen = false;

self.addEventListener('message', event => {
  if (event.data === 'page-closed') { pageOpen = false; return; }
  if (event.data === 'page-open')   { pageOpen = true;  return; }
});

// ── Web Push ──────────────────────────────────────────────────────────────────
function formatSender(from, fromId) {
  if (fromId && from && from !== fromId) return `${from} (${fromId})`;
  return fromId || from || 'Someone';
}

self.addEventListener('push', event => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { return; }

  if (pageOpen) return; // in-app indicators are sufficient while app is open

  let title, body, url, tag;

  if (payload.channelId) {
    // tan/chat payload format — sent by ChatController on message post / mention
    const sender = formatSender(payload.from, payload.fromId);
    if (payload.isAnnounce) {
      title = `${payload.channelName || 'NeoNav'}`;
      tag   = `neonav-announce-${payload.channelId}`;
    } else if (payload.mention) {
      title = `Mentioned in ${payload.channelName || 'tan/chat'}`;
      tag   = `neonav-mention-${payload.channelId}`;
    } else {
      title = payload.channelName || 'tan/chat';
      tag   = `neonav-chan-${payload.channelId}`;
    }
    body = `${sender}: ${payload.text || '…'}`;
    url  = `/chat/${payload.channelId}`;
  } else {
    // neonav-native notification format
    title = payload.title || 'NeoNav';
    body  = payload.body  || '';
    url   = payload.url   || '/notifications';
    tag   = payload.tag   || 'neonav';
  }

  let icon;
  if (payload.channelId) {
    icon = payload.isAnnounce
      ? '/maskable_icon_x192_announce.png'
      : '/maskable_icon_x192_chat.png';
  } else if (payload.notifyapp === 'cash') {
    icon = '/maskable_icon_x192_cash.png';
  } else {
    icon = '/maskable_icon_x192_notify.png';
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge   : '/maskable_icon_badgex192.png',
      tag,
      renotify: true,
      data    : { url }
    })
  );
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/notifications';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (new URL(client.url).origin === self.location.origin) {
          return client.focus().then(c => {
            if ('navigate' in c) c.navigate(url);
          });
        }
      }
      return clients.openWindow(url);
    })
  );
});
