import executeApi from '@/utilites/executeApi';
import { 
    APIResponse,
    DispatchFunc,
    netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilites/cookieContext";
import { storedRecently, getLocalStorage, storeFetched } from '@/utilites/localStorage';

export const fetchUserChannels = (dispatch: DispatchFunc) => async () => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      const { data } = response;
      dispatch({
        type: 'setUserChannels',
        payload: data,
      });
      return data;
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Channels failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
      return err;
    };
    executeApi('channels', {token}, onSuccess, onError);
  }
  
  export const fetchUserContacts = (dispatch: DispatchFunc) => async () => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      const { data } = response;
      storeFetched('contacts', data);
      dispatch({
        type: 'setUserContacts',
        payload: data,
      })
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Contact failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
    };

    if (storedRecently('contacts')) {
      const data = getLocalStorage('contacts');
      dispatch({
        type: 'setUserContacts',
        payload: data,
      })
    } else {
      executeApi('contacts', {token}, onSuccess, onError);
    }
  }

  export const fetchChannelHistory = (dispatch: DispatchFunc) => async (id:string) => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      const { data } = response;
      storeFetched(id, data);
      dispatch({
        type: 'setMessageHistory',
        payload: data,
      })
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Chat History failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
    };

    if (storedRecently(id)) {
      const data = getLocalStorage(id);
      dispatch({
        type: 'setMessageHistory',
        payload: data,
      })
    } else {
      executeApi('chatHistory', {token, id}, onSuccess, onError);
    }
  }