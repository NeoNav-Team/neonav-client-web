'use client';
import merge from 'deepmerge';
import DataContextCreator from "./dataContextCreator";
import { 
  Action,
  DispatchFunc,
  NnProviderValues,
  NnStore, 
} from "./nnTypes";
import {
  closeAlert,
  fetchNetworkStatus,
} from './nnActionsNetwork';
import {
  fetchUserWallets,
  fetchUserWalletHistory,
  sendPayment,
  requestPayment,
} from './nnActionsCash';
import {
  fetchUserContacts,
  fetchUserChannels,
} from './nnActionsChat';
import { nnSchema } from "./nnSchema";
import { getCookieContext, getCookieToken, scrubCookieData, setCookieContext } from "@/utilites/cookieContext";
import { getLocalStorage, setLocalStorage } from '@/utilites/localStorage';

const defaultNnContext:NnStore = merge({}, nnSchema);

export const nnReducer = (state:NnProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
  let index = 0;
  let clonedState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case 'setAlert':
      clonedState.network.alert = {...clonedState.network.alert, ...payload}
      break;
    case 'initContext':
      clonedState = {...clonedState, ...payload};
      break;
    case 'setUserChannels':
        clonedState.user.channels = payload;
        break;
    case 'setUserWallets':
      clonedState.user.wallets = payload;
      break;
    case 'setWalletTransactions':
      const walletId = clonedState.network.selected.account;
      index = clonedState.network.collections.transactions.map((e:any) => e.id).indexOf(walletId);
      if (index !== -1) {
        clonedState.network.collections.transactions[index].collection = payload;
      }
      break;
    case 'setUserWallets':
      clonedState.user.wallets = payload;
      break;
    case 'setUserContacts':
      index = clonedState.network.collections.users.map((e:any) => e.id).indexOf('contacts');
      if (index !== -1) {
        clonedState.network.collections.users[index].collection = payload;
      }
      break;
    case 'setNetwork':
      clonedState.network.location = payload;
      break;
  }
  newState = {...state, ...clonedState};
  const { cookieData, localStorageData  } = scrubCookieData(newState);
  cookieData && setCookieContext(cookieData);
  setLocalStorage('nnCollection', localStorageData);
  console.log(type, payload);
  return newState;
};

export const initContext = (dispatch: DispatchFunc) => async () => {
  let onLoadUserContext = {};
  const cookieContextData = getCookieContext();
  const storedCollections = getLocalStorage('nnCollection')
  if (Object.keys(cookieContextData).length === 0) {
    // creates nnContext cookie if one does not exist
    const cookieJWTData = getCookieToken();
    const cookieDataArr = cookieJWTData.split('.');
    const cookieDataObj =  JSON.parse(window.atob(cookieDataArr[1]));
    //creates empt default context with just the userID
    const jwtContext =  {
        network: {
        selected:{
          account: cookieDataObj.id,
        },
        collections: {
          transactions: [
            {
              id: cookieDataObj.id,
              collection: [],
            }
          ]
        }
      },
      user: {
        auth: {
          userid: cookieDataObj.id,
        }
      }
    };
    onLoadUserContext = merge.all([onLoadUserContext, defaultNnContext, jwtContext]);
    setCookieContext(onLoadUserContext);
  } else {
    const collectionContext =  {
      network: {
        collections: storedCollections
      }
    };
    onLoadUserContext = merge.all([onLoadUserContext, cookieContextData, collectionContext]);
  }
  //dispatches context to state
  dispatch({
    type: 'initContext',
    payload: onLoadUserContext,
  })
}


export const { Context, Provider } = DataContextCreator(
  nnReducer,
  { 
    closeAlert,
    fetchNetworkStatus,
    fetchUserWallets,
    fetchUserWalletHistory,
    fetchUserContacts,
    fetchUserChannels,
    initContext,
    sendPayment,
    requestPayment,
  },
  defaultNnContext,
);