import executeApi from '@/utilities/executeApi';
import { getCookieClipboard } from  '@/utilities/cookieContext';
import { 
  APIResponse,
  DispatchFunc
} from "./nnTypes";

export const closeAlert = (dispatch: DispatchFunc) => async () => {
  dispatch({
    type: 'setAlert',
    payload: {show: false},
  })
};

export const closeAnnouncement = (dispatch: DispatchFunc) => async () => {
  dispatch({
    type: 'setAnnouncement',
    payload: {},
  })
};
  
export const setSelected = (dispatch: DispatchFunc) => async (indexType:string, index:string) => {
  dispatch({
    type: 'setSelected',
    payload: {[indexType]: index},
  })
};

export const fetchClipboardEntities = (dispatch: DispatchFunc) => async () => {
  // grab the clipboard values
  const payload = getCookieClipboard();
  dispatch({
    type: 'setClipboardEntities',
    payload,
  })
};

  
export const fetchNetworkStatus = (dispatch: DispatchFunc) => async () => {
  const onSuccess = (response:APIResponse) => {
    dispatch({
      type: 'setNetwork',
      payload: response?.data?.message,
    })
  };
  const onError = (err:object) => {
    dispatch({
      type: 'setNetwork',
      payload: 'offline',
    })
  };
  executeApi('netCheck', {}, onSuccess, onError);
}
