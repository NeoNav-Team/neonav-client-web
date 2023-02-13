'use client';
import merge from 'deepmerge';
import DataContextCreator from "./dataContextCreator";
import { NnProviderValues, NnStore } from "./nnTypes";
import { nnSchema } from "./nnSchema";
import { getCookieContext, getCookieToken, setCookieContext } from "@/utilites/cookieContext";
import executeApi from '@/utilites/executeApi';

type ActionTypes = 'setNetwork' | 
  'setUserWallets' | 
  'setUserContacts' | 
  'initContext';

interface Action {
  type: ActionTypes,
  payload?: Object,
}

interface walletAPIResData {
  balance?: Number;
  owner?: String;
}

interface netcheckAPIResData {
  message?: String;
}

interface APIResData extends walletAPIResData, netcheckAPIResData {
  _id: String;
  _rev: String;
}

interface APIResponse {
  data: APIResData;
}

type DispatchFunc = (dispatch: Action) => void;

const defaultNnContext:NnStore = merge({}, nnSchema);

export const nnReducer = (state:NnProviderValues, action: Action) => {
  const {payload = {}, type = null} = action;
  let newState = {};
  switch (type) {
    case 'initContext':
      newState = payload
      break;
    case 'setUserWallets':
      newState = merge(state, { user: { wallets: payload } });
      break;
    case 'setUserContacts':
      newState = merge(state, { user: { contacts: payload } });
      break;
    case 'setNetwork':
      newState = merge(state,  { network: { location: payload } });
      break;
  }
  console.log(type, payload, newState);
  setCookieContext(newState);
  return newState;
};

export const initContext = (dispatch: DispatchFunc) => async () => {
  let onLoadUserContext = {};
  const cookieContextData = getCookieContext();
  if (Object.keys(cookieContextData).length === 0) {
    // creates nnContext cookie if one does not exist
    const cookieJWTData = getCookieToken();
    const cookieDataArr = cookieJWTData.split('.');
    const cookieDataObj =  JSON.parse(window.atob(cookieDataArr[1]));
    let userByJWT = {
      auth: {
        userid: cookieDataObj.id,
      },
    };
    //creates empt default context with just the userID
    merge.all([onLoadUserContext, defaultNnContext, { user: userByJWT }]);
    setCookieContext(onLoadUserContext);
  } else {
    onLoadUserContext = cookieContextData;
  }
  //dispatches context to state
  dispatch({
    type: 'initContext',
    payload: onLoadUserContext,
  })
}

export const fetchUserWallets = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setUserWallets',
      payload: data,
    })
  };
  const onError = (err:object) => {
    console.log('error', err);
  };
  executeApi('wallets', {token}, onSuccess, onError);
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
  const onError = (err:object) => {
    console.log('error', err);
  };
  executeApi('contacts', {token}, onSuccess, onError);
}

export const sendPayment = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    // dispatch({
    //   type: 'setUserContacts',
    //   payload: data,
    // })
  };
  const onError = (err:object) => {
    console.log('error', err);
  };
  executeApi('contacts', {token}, onSuccess, onError);
}

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

export const { Context, Provider } = DataContextCreator(
  nnReducer,
  { 
    fetchNetworkStatus,
    fetchUserWallets,
    fetchUserContacts,
    initContext,
  },
  defaultNnContext,
);