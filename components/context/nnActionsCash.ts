import executeApi from '@/utilites/executeApi';
import { 
    APIResponse,
    DispatchFunc,
    netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilites/cookieContext";
import { storedRecently, getLocalStorage, storeFetched } from '@/utilites/localStorage';

export const sendPayment = (dispatch: DispatchFunc) => (recipient:string, amount:string) => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      dispatch({
        type: 'setAlert',
        payload: {severity: 'success', message: 'Payments Sucessful', show: true},
      })
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Payment Failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
    };
    setTimeout(() => executeApi('pay', {token, recipient, amount}, onSuccess, onError), 2000);
  }
  
export const requestPayment = (dispatch: DispatchFunc) => (id:string, amount:string) => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      dispatch({
        type: 'setAlert',
        payload: {severity: 'success', message: 'Requests Sucessful', show: true},
      })
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Request Failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
    };
    setTimeout(() => executeApi('request', {token, id, amount}, onSuccess, onError), 2000);
  }

export const fetchUserWallets = (dispatch: DispatchFunc) => async () => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      const { data } = response;
      dispatch({
        type: 'setUserWallets',
        payload: data,
      });
      return data;
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Wallets failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
      return err;
    };
    executeApi('wallets', {token}, onSuccess, onError);
  }
  
 export const fetchUserWalletHistory = (dispatch: DispatchFunc) => async () => {
    const token = getCookieToken();
    const onSuccess = (response:APIResponse) => {
      const { data } = response;
      storeFetched('userWallet', data);
      dispatch({
        type: 'setWalletTransactions',
        payload: data,
      })
    };
    const onError = (err:netcheckAPIResData) => {
      const { message = 'Wallet History failure' } = err;
      dispatch({
        type: 'setAlert',
        payload: {severity: 'error', message, show: true},
      })
    };
    if (storedRecently('userWallet')) {
      const data = getLocalStorage('userWallet');
      dispatch({
        type: 'setWalletTransactions',
        payload: data,
      })
    } else {
      executeApi('walletHistory', {token}, onSuccess, onError); 
    }
  };