'use client';
import merge from 'deepmerge';
import DataContextCreator from "./dataContextCreator";
import { 
  Action,
  DispatchFunc,
  NnIndexCollection,
  NnProviderValues,
  NnStore,
  NnCollectionKeys,
} from "./nnTypes";
import {
  closeAlert,
  fetchNetworkStatus,
  setSelected,
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
  fetchChannelHistory,
} from './nnActionsChat';
import { nnSchema } from "./nnSchema";
import { getCookieContext, getCookieToken, scrubCookieData, setCookieContext } from "@/utilites/cookieContext";
import { getLocalStorage, setLocalStorage } from '@/utilites/localStorage';

const defaultNnContext:NnStore = merge({}, nnSchema);

const setCollectionByIndex = (state:NnStore, collectionName:NnCollectionKeys, id:string, payload:NnIndexCollection[]) => {
  let clonedState = JSON.parse(JSON.stringify(state));
  const collection = clonedState.network?.collections[collectionName];
  let index = -1;
  // if (collection.length) {
  //   const indexes = collection.map((x:Record<string, any>) => { return x.id; });
  //   index = indexes.length ? indexes.indexOf(id) : index;
  // }
  if (index !== -1) {
    const collectionItem = collection[index];
    collectionItem.collection = payload
  }
  if (!collection.length || index === -1) {
    const newCollection:NnIndexCollection = {id: id, collection: payload};
    collection.push(newCollection);
  } 
  return clonedState;
}

export const nnReducer = (state:NnProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
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
      clonedState = setCollectionByIndex(clonedState, 'transactions', walletId, payload as NnIndexCollection[]);
      break;
    case 'setUserContacts':
      clonedState = setCollectionByIndex(clonedState, 'users', 'contacts', payload as NnIndexCollection[]);
      break;
    case 'setMessageHistory':
      const channelId = clonedState.network.selected.channel;
      clonedState = setCollectionByIndex(clonedState, 'chats', channelId, payload as NnIndexCollection[]);
      break;
    case 'setNetwork':
      clonedState.network.location = payload;
      break;
    case 'setSelected':
        clonedState.network.selected = merge.all([clonedState.network.selected, payload]);
      break;
  }
  newState = {...state, ...clonedState};
  const { cookieData, localStorageData  } = scrubCookieData(newState);
  cookieData && setCookieContext(cookieData);
  setLocalStorage('nnCollection', localStorageData);
  console.log('nnReducer', type, payload, newState);
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
    fetchChannelHistory,
    initContext,
    requestPayment,
    sendPayment,
    setSelected,
  },
  defaultNnContext,
);