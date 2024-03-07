import isBrowser from './isBrowser';

const LAST_FETCHED_LIMIT = 3; // minutes to leave in local storage before doing a new call

export const getLocalStorage = (key: string) => {
  const payload = localStorage.getItem(key) || '{}';
  const stringState = payload.length >= 3 ? decodeURIComponent(escape(window.atob(payload))) : '{}';
  const decodedPayload =  JSON.parse(stringState);
  return decodedPayload;
}

export const setLocalStorage = (key:string, payload:Record<string, any>) => {
  const encodedValue = JSON.stringify(payload);
  const encodedStringState = window.btoa(unescape(encodeURIComponent(encodedValue)));
  localStorage.setItem(key, encodedStringState);
}

export const clearLocalStorage = (key:string) => {
  isBrowser && localStorage.setItem(key, '');
};

export const localStorageExists = (key:string) => {
  const storage = getLocalStorage(key);
  return Object.keys(storage).length >= 1;
}

export const storedRecently = (key:string, mins?:number) => {
  let isRecent = false;
  const delayLimit = mins ? mins : LAST_FETCHED_LIMIT;
  const last = getLocalStorage(`lastFetch_${key}`);
  if (Object.keys(last).length >= 1) {
    const now = new Date().getTime();
    const lastdate = last ? new Date(last.date).getTime() : now;
    const difference = now - lastdate;
    const minutes = Math.round(((difference % 86400000) % 3600000) / 60000);
    isRecent = minutes < delayLimit;
    console.log(`last fetch was ${minutes} mins ago so data is ${isRecent ? `local storage` : `new fetch`}`);
  }
  return isRecent;
}

export const storeFetched = (key:string, payload:Record<string, any>) => {
  const currentTime = new Date().toISOString();
  const dateObj = {date: currentTime};
  setLocalStorage(key, payload);
  setLocalStorage(`lastFetch_${key}`, dateObj);
}