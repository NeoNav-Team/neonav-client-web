import { NnStore, nnEntity } from "@/components/context/nnTypes";
import Cookies from "js-cookie";

const MAX_UNREAD_COUNTED = 1000;
const MAX_CLIPBOARD_ITEMS = 50;

export const setCookieContext = (state:NnStore) => {
  console.log('setCookieContext', state);
  const stringState = JSON.stringify(state);
  const encodedStringState = window.btoa(unescape(encodeURIComponent(stringState)));
  Cookies.remove('nnContext', { domain: '.neonav.net' }); 
  Cookies.set('nnContext', encodedStringState, { domain: '.neonav.net' });
};

export const getCookieContext = () => {
  const encodedStringState = Cookies.get('nnContext') || '';
  const stringState = encodedStringState.length >= 3 ? decodeURIComponent(escape(window.atob(encodedStringState))) : '{}';
  const cookieContext = JSON.parse(stringState);
  return cookieContext;
}

export const getCookieToken = () => {
  return Cookies.get('accessToken') || '';
}

export const getCookieUnread = () => {
  const encodedStringState = Cookies.get('nnUnread') || '';
  const unreadString = encodedStringState.length >= 3 ? decodeURIComponent(escape(window.atob(encodedStringState))) : '';
  const unreadArr = unreadString.length >= 6 ? unreadString.split(',') : [];
  return unreadArr;
}

export const setCookieUnread = (newUnread:string) => {
  const unreadArr = getCookieUnread();
  if (unreadArr.length >= MAX_UNREAD_COUNTED) { //limiting count since spam
    unreadArr.shift();
  }
  unreadArr.push(newUnread);
  const unreadString = unreadArr.join(',');
  const encodedStringState = window.btoa(unescape(encodeURIComponent(unreadString)));
  Cookies.set('nnUnread', encodedStringState, { domain: '.neonav.net' });
}

export const filterCookieUnread = (newUnread:string) => {
  const unreadArr = getCookieUnread();
  unreadArr.filter((unread:string) => { return unread !== newUnread});
  const unreadString = unreadArr.join(',');
  const encodedStringState = window.btoa(unescape(encodeURIComponent(unreadString)));
  Cookies.set('nnUnread', encodedStringState, { domain: '.neonav.net' });
}

export const clearCookieUnread = () => {
  Cookies.set('nnUnread', '', { domain: '.neonav.net' });
  return [];
}

//TODO: update functions to use same set of set / update collection functions

export const getCookieClipboard = () => {
  const encodedStringState = Cookies.get('nnClipboard') || '';
  const clipboardString = encodedStringState.length >= 3 ? decodeURIComponent(escape(window.atob(encodedStringState))) : '';
  const clipboardEntitiesArr = clipboardString.length >= 6 ? JSON.parse(clipboardString) : [];
  return clipboardEntitiesArr;
}

export const setCookieClipboard = (clipboardEntity:nnEntity[]) => {
  const clipboardArr = getCookieClipboard();
  if (clipboardArr.length >= MAX_CLIPBOARD_ITEMS) {
    clipboardArr.shift();
  }
  clipboardArr.push(clipboardEntity);
  const unreadString = JSON.stringify(clipboardArr);
  const encodedStringState = window.btoa(unescape(encodeURIComponent(unreadString)));
  Cookies.set('nnClipboard', encodedStringState, { domain: '.neonav.net' });
};