import { NnStore } from "@/components/context/nnTypes";
import Cookies from "js-cookie";

const MAX_UNREAD_COUNTED = 1000;

export const setCookieContext = (state:NnStore) => {
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

export const clearCookieUnread = (clearedUnread:string) => {
  const unreadArr = getCookieUnread();
  const filteredArr = unreadArr.filter(unread => unread !== clearedUnread);
  const unreadString = filteredArr.join(',');
  Cookies.set('nnUnread', unreadString, { domain: '.neonav.net' });
  return filteredArr;
}

export const clearCookieUnreadAll = () => {
  Cookies.set('nnUnread', '', { domain: '.neonav.net' });
  return [];
}