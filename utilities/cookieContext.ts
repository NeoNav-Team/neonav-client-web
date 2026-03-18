import { NnStore, nnEntity, NnSimpleEntity } from "@/components/context/nnTypes";
import Cookies from "js-cookie";

const MAX_UNREAD_COUNTED = 1000;
const MAX_CLIPBOARD_ITEMS = 50;

const setSimpleEntity = (contact:nnEntity): NnSimpleEntity => {
  return {
    'id': contact?.id || '',
    'userid': contact?.userid || '',
    'name': contact?.name || '',
    'username': contact?.username || '',
  }
}
const simplifyEntities =(entities: nnEntity[]): NnSimpleEntity[] => {
  return entities.map(entity => {
    return setSimpleEntity(entity);
  })
}

export const setCookieContext = (state:NnStore) => {
  // removes all thumbnails from cookies as they were breaking the length of possible cookie values
  if (state.network && state.network.collections) {
    if (state?.network?.collections.contacts){
      state.network.collections.contacts = 
      simplifyEntities(state.network.collections.contacts)
    }
    if (state?.network?.collections.entityUsers){
      state.network.collections.entityUsers = 
      simplifyEntities(state.network.collections.entityUsers)
    }
    if (state?.network?.collections.factions){
      state.network.collections.factions = 
      simplifyEntities(state.network.collections.factions)
    }
    if (state?.network?.collections.clipboardEntities){
      state.network.collections.clipboardEntities = 
      simplifyEntities(state.network.collections.clipboardEntities)
    }
    if (state?.network?.collections.contacts){
      state.network.collections.contacts = 
      simplifyEntities(state.network.collections.contacts)
    }
  }
  if (state.user) {
    if (state?.user?.factions){
      state.user.factions = 
      simplifyEntities(state?.user?.factions)
    }
  }
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

export const setCookieToken = (newToken:string) => {
  Cookies.remove('accessToken', { domain: '.neonav.net' });
  Cookies.set('accessToken', newToken, { domain: '.neonav.net' });
}

//TODO: update functions to use same set of set / update collection functions

export const getCookieClipboard = (): nnEntity[] => {
  const encodedStringState = Cookies.get('nnClipboard') || '';
  const clipboardString = encodedStringState.length >= 3 ? decodeURIComponent(escape(window.atob(encodedStringState))) : '';
  const clipboardEntitiesArr = clipboardString.length >= 6 ? JSON.parse(clipboardString) : [];
  return clipboardEntitiesArr;
}

export const setCookieClipboard = (clipboardEntity:nnEntity) => {
  const clipboardArr = getCookieClipboard();
  const simpleEntity = setSimpleEntity(clipboardEntity);
  if (clipboardArr.length >= MAX_CLIPBOARD_ITEMS) { //limiting count since spam
    clipboardArr.shift();
  }
  clipboardArr.push(simpleEntity);
  const unreadString = JSON.stringify(clipboardArr);
  const encodedStringState = window.btoa(unescape(encodeURIComponent(unreadString)));
  Cookies.set('nnClipboard', encodedStringState, { domain: '.neonav.net' });
};