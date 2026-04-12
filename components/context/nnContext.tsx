'use client';
import merge from 'deepmerge';
import DataContextCreator from "./dataContextCreator";
import {
  Action,
  DispatchFunc,
  LooseObject,
  NnChatMessage,
  NnProviderValues,
  NnStore,
} from './nnTypes';
import {
  closeAlert,
  closeAnnouncement,
  fetchClipboardEntities,
  fetchNetworkStatus,
  setAlert,
  setSelected,
} from './nnActionsNetwork';
import {
  addRecentScan,
  befriend,
  fetchContact,
  fetchUserProfile,
  patchUserToken,
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
  banUserFromChannel,
  createNewChannel,
  clearUnreadCountByType,
  deleteChannelMessage,
  fetchChannelsLatest,
  joinUserToChannel,
  inviteUserToChannel,
  fetchUserChannels,
  fetchChannelHistory,
  fetchChannelDetails,
  fetchChannelUsers,
  longPollMessages,
  sendChannelMessage,
  leaveUserChannel,
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
import {
  addLocationPin,
  addLocationReview,
  createFactionLocation,
  createLocation,
  deleteLocation,
  deleteLocationPins,
  deleteLocationReview,
  fetchAllLocations,
  fetchLocationById,
  fetchLocationPins,
  fetchUnverifiedLocations,
  updateFactionLocation,
  updateLocation,
  verifyLocation,
} from './nnActionsLocation';
import {
  fetchAllEvents,
  fetchUserEventsAttending,
  fetchUserEventsMine,
  fetchLocationEvents,
  rsvpEvent,
  updateEvent,
  createEvent,
  cancelEvent,
} from './nnActionsEvent';
import { nnSchema } from "./nnSchema";
import {
  getCookieContext,
  getCookieToken,
  setCookieContext,
  setCookieToken,
} from "@/utilities/cookieContext";

const defaultNnContext:NnStore = merge({}, nnSchema);

export const nnReducer = (state:NnProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
  let clonedState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case 'addMessage': 
      break;
    case 'setAccessToken':
      const tokenPayload = JSON.parse(JSON.stringify(payload));
      setCookieToken(tokenPayload.accessToken);
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
    case 'setLocations':
      clonedState.network.collections.locations = payload;
      break;
    case 'setEvents':
      clonedState.network.collections.events = payload;
      break;
    case 'updateLocation':
      const location = clonedState.network.collections.locations.find((l:any) => l.id === (payload as any)?.id);
      if (location) {
        clonedState.network.collections.locations = clonedState.network.collections.locations.map((l:any) => l.id === (payload as any)?.id ? payload as any : l);
      } else {
        clonedState.network.collections.locations.push(payload);
      }
      break;
    case 'setLocationPins':
      clonedState.network.collections.locationPins = payload;
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
    case 'setNetwork':
      clonedState.network.location = payload;
      break;
    case 'setSelected':
      clonedState.network.selected = merge.all([clonedState.network.selected, payload]);
      break;
    case 'receiveMessage': {
      const msg:NnChatMessage = JSON.parse(JSON.stringify(payload));
      const msgChannel = msg.channel as string;
      if (msgChannel === clonedState.network.selected.channel) {
        clonedState.network.collections.messages.unshift(msg);
      }
      const myAccount = clonedState.network.selected.account;
      if (msg.fromid !== myAccount) {
        const current: LooseObject = clonedState.network.selected.unread || {};
        clonedState.network.selected.unread = { ...current, [msgChannel]: (current[msgChannel] || 0) + 1 };
      }
      break;
    }
    case 'setUnreadCount':
      clonedState.network.selected.unread = payload;
      break;
    case 'clearChannelUnread': {
      const ch = payload as unknown as string;
      const current: LooseObject = clonedState.network.selected.unread || {};
      clonedState.network.selected.unread = { ...current, [ch]: 0 };
      break;
    }
  }
  newState = {...state, ...clonedState};
  const cookieState = JSON.parse(JSON.stringify(newState));
  delete cookieState.entity;
  setCookieContext(cookieState);
  console.log('newState', newState);
  return newState;
};

const decodeJwtPayload = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return {};
    // JWT uses base64url — convert to standard base64 before atob
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return {};
  }
};

export const initContext = (dispatch: DispatchFunc) => async () => {
  let onLoadUserContext = {};
  const cookieContextData = getCookieContext();
  // Always decode JWT for authoritative user identity (handles base64url encoding)
  const jwtPayload = decodeJwtPayload(getCookieToken());
  const jwtId = jwtPayload.id ?? '';

  if (Object.keys(cookieContextData).length === 0) {
    // creates nnContext cookie if one does not exist
    //creates empty default context with just the userID
    const jwtContext =  {
      network: {
        selected:{
          account: jwtId,
        },
        collections: {
          transactions: [
            {
              id: jwtId,
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
            userid: jwtId,
          }
        }
      }
    };
    onLoadUserContext = merge.all([onLoadUserContext, defaultNnContext, jwtContext]);
    setCookieContext(onLoadUserContext);
  } else {
    onLoadUserContext = cookieContextData;
    // Repair stale/empty identity fields using the JWT as source of truth
    if (jwtId && !(onLoadUserContext as any)?.network?.selected?.account) {
      (onLoadUserContext as any).network = {
        ...(onLoadUserContext as any).network,
        selected: { ...(onLoadUserContext as any).network?.selected, account: jwtId },
      };
    }
    if (jwtId && !(onLoadUserContext as any)?.user?.profile?.auth?.userid) {
      (onLoadUserContext as any).user = {
        ...(onLoadUserContext as any).user,
        profile: {
          ...(onLoadUserContext as any).user?.profile,
          auth: { ...(onLoadUserContext as any).user?.profile?.auth, userid: jwtId },
        },
      };
    }
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
    addLocationReview,
    addLocationPin,
    addRecentScan,
    addRepToFaction,
    addUserToFaction,
    adminUserToChannel,
    banUserFromChannel,
    befriend,
    clearUnreadCountByType,
    deleteChannelMessage,
    closeAlert,
    closeAnnouncement,
    createFactionLocation,
    createLocation,
    createNewChannel,
    deleteLocation,
    deleteLocationPins,
    deleteLocationReview,
    fetchAllFactions,
    fetchAllLocations,
    fetchChannelDetails,
    fetchChannelHistory,
    fetchChannelUsers,
    fetchChannelsLatest,
    fetchContact,
    fetchClipboardEntities,
    fetchFactionDetails,
    fetchFactionStatuses,
    fetchLocationPins,
    fetchNetworkStatus,
    fetchUserChannels,
    fetchUserContacts,
    fetchUserFactions,
    fetchLocationById,
    fetchUnverifiedLocations,
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
    leaveUserChannel,
    longPollMessages,
    patchUserToken,
    removeRepToFaction,
    removeStatus,
    removeUserFromChannel,
    removeUserFromFaction,
    requestPayment,
    requestFactionPayment,
    sendChannelMessage,
    sendFactionPayment,
    sendPayment,
    setAlert,
    setFactionUserStatus,
    setSelected,
    setUserHiddenStatus,
    setUserStatus,
    toggleChannelScope,
    toggleStatusClass,
    unfriend,
    updateFactionLocation,
    updateFactionProfile,
    updateLocation,
    updateUserProfile,
    userSearch,
    verifyLocation,
    fetchAllEvents,
    fetchUserEventsAttending,
    fetchUserEventsMine,
    fetchLocationEvents,
    rsvpEvent,
    updateEvent,
    createEvent,
    cancelEvent,
  },
  defaultNnContext,
);