import executeApi from '@/utilites/executeApi';
import { 
    APIResponse,
    DispatchFunc,
    netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilites/cookieContext";

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
    executeApi('contacts', {token}, onSuccess, onError);
  }