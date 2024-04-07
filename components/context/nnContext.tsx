'use client';
import merge from 'deepmerge';
import DataContextCreator from "./dataContextCreator";
import { 
  Action,
  DispatchFunc,
  NnChatMessage,
  NnProviderValues,
  NnStore,
} from './nnTypes';
import {
  closeAlert,
  closeAnnouncement,
  fetchClipboardEntities,
  fetchNetworkStatus,
  setSelected,
} from './nnActionsNetwork';
import {
  addRecentScan,
  befriend,
  fetchContact,
  fetchUserProfile,
  fetchUserContacts,
  updateUserProfile,
  unfriend,
  setUserStatus,
  fetchUserStatuses,
  setUserHiddenStatus,
  fetchUserSetStatuses,
  toggleStatusClass,
  removeStatus,
  userSearch,
} from './nnActionsUser';
import {
  fetchUserWallets,
  fetchUserWalletHistory,
  fetchFactionWalletHistory,
  requestPayment,
  requestFactionPayment,
  sendPayment,
  sendFactionPayment,
} from './nnActionsCash';
import {
  adminUserToChannel,
  createNewChannel,
  clearUnreadCountByType,
  joinUserToChannel,
  inviteUserToChannel,
  fetchUserChannels,
  fetchChannelHistory,
  fetchChannelDetails,
  fetchChannelUsers,
  fetchUnreadCount,
  longPollMessages,
  sendChannelMessage,
  removeUserFromChannel,
  toggleChannelScope,
} from './nnActionsChat';
import {
  fetchUserFactions,
  fetchFactionDetails,
  fetchAllFactions,
  updateFactionProfile,
  removeUserFromFaction,
  joinFaction,
  addUserToFaction,
  addRepToFaction,
  removeRepToFaction,
  setFactionUserStatus,
  fetchFactionStatuses,
} from './nnActionsFaction';
import { nnSchema } from "./nnSchema";
import { 
  getCookieContext,
  getCookieToken,
  setCookieContext,
} from "@/utilities/cookieContext";
import { restrictedChannels } from "@/utilities/constants";

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
    case 'setAnnouncement':
      clonedState.network.announcement = payload;
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
    case 'setClipboardEntities':
      clonedState.network.collections.clipboardEntities = payload;
      break;
    case 'updateClipboardEntities':
      let clipboardEntities = clonedState.network.collections.clipboardEntities;
      if (!clipboardEntities.includes(payload)) {
        clipboardEntities.unshift(payload);
      }
      clonedState.network.collections.clipboardEntities = clipboardEntities;
      break;
      // TODO: refactor to setCollection and updateCollection
    case 'setUserStatuses':
      clonedState.network.collections.statuses = payload;
      break;
    case 'setUserHiddenStatuses':
      clonedState.network.collections.hiddenStatuses = payload;
      break;
    case 'setFactions':
      clonedState.network.collections.factions = payload;
      break;
    case 'setMessageHistory':
      clonedState.network.collections.messages = payload;
      break;
    case 'updateMessageHistory':
      const clonedPayload:NnChatMessage = JSON.parse(JSON.stringify(payload));
      if (
        clonedPayload.channel == clonedState.network.selected.channel
        || clonedPayload.channel == restrictedChannels[1]
      ){ // if selected channel or announcement
        clonedState.network.collections.messages.unshift(payload);
      }
      break;
    case 'setNetwork':
      clonedState.network.location = payload;
      break;
    case 'setSelected':
      clonedState.network.selected = merge.all([clonedState.network.selected, payload]);
      break;
    case 'setUnreadCount':
      clonedState.network.selected.unread = payload;
      break;
  }
  newState = {...state, ...clonedState};
  const cookieState = JSON.parse(JSON.stringify(newState));
  delete cookieState.entity;
  setCookieContext(cookieState);
  console.log('newState', newState);
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
    //creates empty default context with just the userID
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
          ],
          contacts: [],
          entityUsers: [],
          factions: [],
          statuses: [],
          clipboardEntities: [],
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
    addRecentScan,
    addRepToFaction,
    addUserToFaction,
    adminUserToChannel,
    befriend,
    clearUnreadCountByType,
    closeAlert,
    closeAnnouncement,
    createNewChannel,
    fetchAllFactions,
    fetchChannelDetails,
    fetchChannelHistory,
    fetchChannelUsers,
    fetchContact,
    fetchClipboardEntities,
    fetchFactionDetails,
    fetchFactionStatuses,
    fetchNetworkStatus,
    fetchUnreadCount,
    fetchUserChannels,
    fetchUserContacts,
    fetchUserFactions,
    fetchUserProfile,
    fetchUserSetStatuses,
    fetchUserStatuses,
    fetchUserWalletHistory,
    fetchFactionWalletHistory,
    fetchUserWallets,
    initContext,
    joinFaction,
    joinUserToChannel,
    inviteUserToChannel,
    longPollMessages,
    removeRepToFaction,
    removeStatus,
    removeUserFromChannel,
    removeUserFromFaction,
    requestPayment,
    requestFactionPayment,
    sendChannelMessage,
    sendFactionPayment,
    sendPayment,
    setFactionUserStatus,
    setSelected,
    setUserHiddenStatus,
    setUserStatus,
    toggleChannelScope,
    toggleStatusClass,
    unfriend,
    updateFactionProfile,
    updateUserProfile,
    userSearch,
  },
  defaultNnContext,
);