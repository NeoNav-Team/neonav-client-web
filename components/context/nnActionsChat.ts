import axios from 'axios';
import executeApi from '@/utilities/executeApi';
import longPollApi from '@/utilities/longPollApi';
import {
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
  NnChatMessage,
  LooseObject
} from './nnTypes';
import { getCookieToken } from '@/utilities/cookieContext';
import { restrictedChannels, apiUrl, authApiEnpoints } from '@/utilities/constants';
import { clearLocalStorage } from '@/utilities/localStorage';
import {
  idbGetMessages,
  idbGetLatestTs,
  idbGetLatestId,
  idbPutMessages,
  idbCullChannel,
  MSG_CAP,
} from '@/utilities/idbMessages';

const alertChannel = restrictedChannels[1];

export const fetchChannelsLatest = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const { path } = (authApiEnpoints as any)['channelsLatest'];
  const url = `${apiUrl.protocol}://${apiUrl.hostname}${path}`;

  let res;
  try {
    res = await axios.get(url, { headers: { 'x-access-token': token } });
  } catch {
    return;
  }
  if (!res?.data) return;

  const latestMessages: any[] = Array.isArray(res.data) ? res.data : [];
  const unreadCounts: LooseObject = {};

  await Promise.all(latestMessages.map(async (latest: any) => {
    const channelId = latest.channel;
    const latestIdbId = await idbGetLatestId(channelId);

    if (latestIdbId === latest.id) {
      unreadCounts[channelId] = 0;
      return;
    }

    // Fetch messages newer than our latest IDB entry
    const latestIdbTs = await idbGetLatestTs(channelId);
    const since = encodeURIComponent(latestIdbTs || latest.ts);
    const histUrl = `${apiUrl.protocol}://${apiUrl.hostname}/api/chat/channels/${channelId}/history?since=${since}`;

    let histRes;
    try {
      histRes = await axios.get(histUrl, { headers: { 'x-access-token': token } });
    } catch {
      unreadCounts[channelId] = 0;
      return;
    }

    const newMsgs: NnChatMessage[] = Array.isArray(histRes?.data) ? histRes.data : [];
    if (!newMsgs.length) {
      unreadCounts[channelId] = 0;
      return;
    }

    const userMsgs = newMsgs.filter(m => m.fromid !== '0000000000');
    unreadCounts[channelId] = userMsgs.length >= MSG_CAP ? MSG_CAP : userMsgs.length;

    await idbPutMessages(newMsgs);
    await idbCullChannel(channelId);
  }));

  dispatch({
    type: 'setUnreadCount',
    payload: unreadCounts,
  });
};

export const clearUnreadCountByType = (dispatch: DispatchFunc) => async (channelId: string) => {
  dispatch({
    type: 'clearChannelUnread',
    payload: channelId,
  });
};

// Normal channel functions

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

export const fetchChannelDetails = (_dispatch: DispatchFunc) => async (_id:string) => {

};

export const fetchChannelUsers = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEntityUserlist',
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
  dispatch({
    type: 'setEntityUserlist',
    payload: [],
  });
  executeApi('channelUsers', {id, token}, onSuccess, onError);
};

export const fetchChannelHistory = (dispatch: DispatchFunc) => async (id: string) => {
  const cached = await idbGetMessages(id);
  if (cached.length > 0) {
    dispatch({
      type: 'setMessageHistory',
      payload: cached,
    });
    return;
  }

  // IDB empty — fall back to API
  const token = getCookieToken();
  const onSuccess = async (response: APIResponse) => {
    const data = response.data as unknown as NnChatMessage[];
    const msgs = Array.isArray(data) ? data : [];
    if (msgs.length) {
      await idbPutMessages(msgs);
    }
    dispatch({
      type: 'setMessageHistory',
      payload: msgs,
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Chat History failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    });
  };
  executeApi('chatHistory', {token, id}, onSuccess, onError);
}

export const sendChannelMessage = (dispatch: DispatchFunc) => async (id:string, text: string) => {
  const token = getCookieToken();
  const onSuccess = (_response:APIResponse) => {};
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Chat Message failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  executeApi('message', {token, text, id}, onSuccess, onError);
}

export const longPollMessages = (dispatch: DispatchFunc) => async (since: string = 'now') => {
  const token = getCookieToken();
  const onSuccess = async (message: NnChatMessage) => {
    const id = message?.id || null;
    const channel = message?.channel || null;
    if (id === null || channel === null) return;

    await idbPutMessages([message]);
    await idbCullChannel(channel);

    dispatch({
      type: 'receiveMessage',
      payload: message,
    });

    if (channel === alertChannel) {
      dispatch({
        type: 'setAnnouncement',
        payload: message,
      });
    }
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Chat Message failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  longPollApi('pollMessages', {token, since}, onSuccess, onError);
}

export const removeUserFromChannel = (dispatch: DispatchFunc) => async (channel:string, id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('lastFetch_channels');
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message:'Adios, space cowboy.', show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Leave channel error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('channelLeave', {channel, id, token}, onSuccess, onError);
};

export const adminUserToChannel = (dispatch: DispatchFunc) => async (channel:string, id:string) => {
  const token = getCookieToken();
  const newAdmin = id;
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('lastFetch_channels');
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message: "You've done a man's job, sir. I guess you're through, huh?", show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Admin channel error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('channelAdmin', {channel, id, newAdmin, token}, onSuccess, onError);
};

export const joinUserToChannel = (dispatch: DispatchFunc) => async (channel:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('lastFetch_channels');
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message: "Joined channel.", show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Join channel error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('channelJoin', {channel, token}, onSuccess, onError);
};

export const inviteUserToChannel = (dispatch: DispatchFunc) => async (channel:string, id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message: `Notification invite to channel sent to user ${id}.`, show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Invite channel error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('channelInvite', {channel, id, token}, onSuccess, onError);
};


export const createNewChannel = (dispatch: DispatchFunc) => async (name:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('lastFetch_channels');
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message: `Created "${name}"`, show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Create channel error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('channelCreate', {name, token}, onSuccess, onError);
};

export const toggleChannelScope = (dispatch: DispatchFunc) => async (channel:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message: data?.message, show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Scope channel error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('channelScope', {channel, token}, onSuccess, onError);
};
