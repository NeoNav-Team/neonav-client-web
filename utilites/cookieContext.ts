import { NnStore } from "@/components/context/nnTypes";
import Cookies from "js-cookie";

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


export const scrubCookieData = (state:NnStore) => {
    let cookieData = JSON.parse(JSON.stringify(state));
    const collections:any = cookieData.network?.collections || {};
    const localStorageData = JSON.parse(JSON.stringify(state.network?.collections));
    for (let key in collections) {
        delete collections[key];
        collections[key] = [];
    }

    return { cookieData, localStorageData };
}