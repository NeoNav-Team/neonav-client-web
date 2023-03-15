'use client';
import merge from 'deepmerge';
import DataContextCreator from "./dataContextCreator";
import { 
  Action,
  DispatchFunc,
  NnProviderValues,
  NnStore,
} from './nnTypes';
import {
  closeAlert,
  fetchNetworkStatus,
  setSelected,
} from './nnActionsNetwork';
import {
  fetchContact,
  unfriend,
  fetchUserContacts,
} from './nnActionsUser';
import {
  fetchUserWallets,
  fetchUserWalletHistory,
  sendPayment,
  sendFactionPayment,
  requestPayment,
} from './nnActionsCash';
import {
  fetchUserChannels,
  fetchChannelHistory,
  fetchChannelDetails,
  fetchChannelUsers,
  longPollMessages,
  sendChannelMessage,
  removeUserFromChannel,
} from './nnActionsChat';
import {
  fetchUserFactions,
} from './nnActionsFaction';
import { nnSchema } from "./nnSchema";
import { getCookieContext, getCookieToken, setCookieContext } from "@/utilites/cookieContext";

const defaultNnContext:NnStore = merge({}, nnSchema);

export const nnReducer = (state:NnProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
  let clonedState = JSON.parse(JSON.stringify(state));
  switch (type) {
  case 'addMessage': 
    break;
  case 'setAlert':
    clonedState.network.alert = {...clonedState.network.alert, ...payload}
    break;
  case 'initContext':
    clonedState = {...clonedState, ...payload};
    break;
  case 'setUserChannels':
    clonedState.user.channels = payload;
    break;
  case 'setUserFactions':
    clonedState.user.factions = payload;
    break;
  case 'setUserWallets':
    clonedState.user.wallets = payload;
    break;
  case 'setWalletTransactions':
    clonedState.network.collections.transactions = payload;
    break;
  case 'setEntity':
    clonedState.network.entity = payload;
    break;
  case 'setEntityUserlist':
    clonedState.network.collections.entityUsers = payload;
    break;
  case 'setUserContacts':
    clonedState.network.collections.contacts = payload;
    break;
  case 'setMessageHistory':
    clonedState.network.collections.messages = payload;
    break;
  case 'updateMessageHistory':
    clonedState.network.collections.messages.unshift(payload);
    break;
  case 'setNetwork':
    clonedState.network.location = payload;
    break;
  case 'setSelected':
    clonedState.network.selected = merge.all([clonedState.network.selected, payload]);
    break;
  }
  newState = {...state, ...clonedState};
  const cookieState = JSON.parse(JSON.stringify(newState));
  delete cookieState.entity;
  setCookieContext(cookieState);
  console.log('newState', type, newState);
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
        profile: {
          auth: {
            userid: cookieDataObj.id,
          }
        }
      }
    };
    onLoadUserContext = merge.all([onLoadUserContext, defaultNnContext, jwtContext]);
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


export const { Context, Provider } = DataContextCreator(
  nnReducer,
  { 
    closeAlert,
    fetchNetworkStatus,
    fetchContact,
    fetchUserWallets,
    fetchUserWalletHistory,
    fetchUserContacts,
    fetchUserChannels,
    fetchUserFactions,
    fetchChannelHistory,
    fetchChannelDetails,
    fetchChannelUsers,
    initContext,
    longPollMessages,
    removeUserFromChannel,
    requestPayment,
    sendChannelMessage,
    sendPayment,
    sendFactionPayment,
    setSelected,
    unfriend,
  },
  defaultNnContext,
);