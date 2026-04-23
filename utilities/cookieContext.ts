import { nnEntity, NnSimpleEntity } from "@/components/context/nnTypes";
import Cookies from "js-cookie";
import { HotbarKey } from "./hotbarOptions";


const MAX_CLIPBOARD_ITEMS = 50;

const setSimpleEntity = (contact:nnEntity): NnSimpleEntity => {
  return {
    'id': contact?.id || '',
    'userid': contact?.userid || '',
    'name': contact?.name || '',
    'username': contact?.username || '',
  }
}

// One-time migration: move nnContext from cookie to localStorage and delete the cookie.
// Can be removed once all active sessions have rotated through.
export const migrateContextCookie = () => {
  if (typeof window === 'undefined') return;
  const cookieValue = Cookies.get('nnContext');
  if (!cookieValue) return;
  try {
    const parsed = JSON.parse(cookieValue);
    if (!localStorage.getItem('nnContext')) {
      localStorage.setItem('nnContext', JSON.stringify(parsed));
    }
  } catch {}
  Cookies.remove('nnContext', { domain: '.neonav.net' });
};

export const setCookieContext = (state: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('nnContext', JSON.stringify(state));
  } catch {}
};

export const getCookieContext = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('nnContext') || '{}');
  } catch {
    return {};
  }
}

export const getCookieToken = () => {
  return Cookies.get('accessToken') || '';
}

export const setCookieToken = (newToken:string) => {
  Cookies.remove('accessToken', { domain: '.neonav.net' });
  Cookies.set('accessToken', newToken, { domain: '.neonav.net', expires: 30 });
}

//TODO: update functions to use same set of set / update collection functions

export const getCookieClipboard = (): nnEntity[] => {
  const encodedStringState = Cookies.get('nnClipboard') || '';
  const clipboardString = encodedStringState.length >= 3 ? decodeURIComponent(escape(window.atob(encodedStringState))) : '';
  const clipboardEntitiesArr = clipboardString.length >= 6 ? JSON.parse(clipboardString) : [];
  return clipboardEntitiesArr;
}


interface NnSettings {
  eventsUnverified?: boolean;
  hotbar?: HotbarKey[];
  mapLayers?: Record<string, boolean>;
  mapGlitch?: boolean;
}

export const getSettingsCookie = (): NnSettings => {
  const value = Cookies.get('nnSettings');
  if (!value) return {};
  try { return JSON.parse(value) as NnSettings; } catch { return {}; }
};

export const setSettingsCookie = (patch: Partial<NnSettings>) => {
  const current = getSettingsCookie();
  Cookies.set('nnSettings', JSON.stringify({ ...current, ...patch }), { domain: '.neonav.net', expires: 365 });
};

export const setCookieClipboard = (clipboardEntity:nnEntity) => {
  const clipboardArr = getCookieClipboard();
  const simpleEntity = setSimpleEntity(clipboardEntity);
  if (clipboardArr.length >= MAX_CLIPBOARD_ITEMS) { //limiting count since spam
    clipboardArr.shift();
  }
  clipboardArr.push(simpleEntity);
  const unreadString = JSON.stringify(clipboardArr);
  const encodedStringState = window.btoa(unescape(encodeURIComponent(unreadString)));
  Cookies.set('nnClipboard', encodedStringState, { domain: '.neonav.net', expires: 30 });
};