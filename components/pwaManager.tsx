'use client';
import { useEffect } from 'react';
import { getCookieToken } from '@/utilities/cookieContext';
import { apiUrl } from '@/utilities/constants';

const API = `${apiUrl.protocol}://${apiUrl.hostname}`;

async function subscribeToPush(swReg: ServiceWorkerRegistration) {
  if (!('PushManager' in window)) return;
  const token = getCookieToken();
  if (!token) return;
  try {
    const existing = await swReg.pushManager.getSubscription();
    if (existing) return; // already subscribed — server already has it

    const keyRes = await fetch(`${API}/api/push/vapidkey`, {
      headers: { 'x-access-token': token }
    });
    if (!keyRes.ok) return;
    const { vapidPub } = await keyRes.json();

    const padding = '='.repeat((4 - vapidPub.length % 4) % 4);
    const base64  = (vapidPub + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawKey  = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    const sub = await swReg.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: rawKey,
    });

    await fetch(`${API}/api/push/subscribe`, {
      method:  'POST',
      headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ subscription: sub }),
    });
  } catch (err) {
    console.warn('Push subscription failed:', err);
  }
}

export default function PwaManager() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        // Tell the SW the page is open so it suppresses duplicate push toasts
        const sendOpen = () =>
          navigator.serviceWorker.controller?.postMessage('page-open');
        sendOpen();
        // Also send once the SW activates (first load, no controller yet)
        reg.addEventListener('updatefound', () => {
          reg.installing?.addEventListener('statechange', e => {
            if ((e.target as ServiceWorker).state === 'activated') sendOpen();
          });
        });

        if (Notification.permission === 'granted') {
          subscribeToPush(reg);
        }
      })
      .catch(err => console.warn('SW registration failed:', err));

    return () => {
      navigator.serviceWorker.controller?.postMessage('page-closed');
    };
  }, []);

  return null;
}

// Call this after the user grants notification permission (e.g. from a settings page).
export async function requestAndSubscribePush(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;
  const reg = await navigator.serviceWorker.ready;
  await subscribeToPush(reg);
  return true;
}

// Removes the push subscription from the browser and the server.
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;
  const token = getCookieToken();
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return true; // nothing to remove
    if (token) {
      await fetch(`${API}/api/push/subscribe`, {
        method:  'DELETE',
        headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ endpoint: sub.endpoint }),
      });
    }
    await sub.unsubscribe();
    return true;
  } catch (err) {
    console.warn('Push unsubscribe failed:', err);
    return false;
  }
}
