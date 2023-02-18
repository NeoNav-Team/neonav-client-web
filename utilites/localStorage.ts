import isBrowser from './isBrowser';

export const getLocalStorage = (key: string) => {
    const payload = localStorage.getItem(key) || '{}';
    const decodedPayload =  JSON.parse(payload);
    return decodedPayload;
 }

export const setLocalStorage = (key:string, payload:string) => {
    const encodedValue = JSON.stringify(payload);
    console.log('encodedValue', encodedValue);
    localStorage.setItem(key, encodedValue);
 }

export const clearLocalStorage = (key:string) => {
    isBrowser && localStorage.setItem(key, '');
 };

 export const localStorageExists = (key:string) => {
    const storage = getLocalStorage(key);
    return Object.keys(storage).length >= 1;
 }