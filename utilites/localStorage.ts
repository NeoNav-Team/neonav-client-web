import isBrowser from './isBrowser';

export const getLocalStorage = (key: string) => {
    const payload = localStorage.getItem(key) || '{}';
    const stringState = payload.length >= 3 ? decodeURIComponent(escape(window.atob(payload))) : '{}';
    const decodedPayload =  JSON.parse(stringState);
    return decodedPayload;
 }

export const setLocalStorage = (key:string, payload:string) => {
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