import isBrowser from './isBrowser';

interface IlocalStorage {
    method:string;
    key:string;
    value?:string;
}

const localStorage = (method:string, key:string, value?:string):string => {

 const getStorage = (key: string) => {
    const payload = isBrowser && 
        typeof window.localStorage.getItem(key) !== null &&
        window.localStorage.getItem(key);
    return payload ? payload : '';
 }
 const setStorage = (key:string, value:string) => {
    isBrowser && window.localStorage.setItem(key, JSON.stringify(value));
    return '';
 }
 const clearStorage = (key:string) => {
    isBrowser && window.localStorage.setItem(key, '');
 };
 const storageExists = (key:string) => {
    const storage = getStorage(key);
    return storage !== '';
 }

    switch (method) {
        case 'set':
            value && setStorage(key, value);
        break;
        case 'get':
            getStorage(key);
        break;
        case 'check':
            storageExists(key);
        case 'clear':
            clearStorage(key);
        break;
        default:
    }
    return '';
}

export default localStorage;