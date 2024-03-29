import executeApi from '@/utilities/executeApi';
import longPollApi from '@/utilities/longPollApi';
import isEmpty from '@/utilities/isEmpty';
import { 
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
  NnChatMessage,
  LooseObject
} from './nnTypes';
import {
  getCookieToken,
  setCookieUnread,
  getCookieUnread,
  filterCookieUnread,
} from '@/utilities/cookieContext';
import { globalChannel, restrictedChannels } from '@/utilities/constants';
import { storedRecently, getLocalStorage, clearLocalStorage, storeFetched } from '@/utilities/localStorage';

const alertChannel = restrictedChannels[1];

// doing this by cookie since we don't have API

export const sortUnread = (unreadArr:string[]) => {
  var unreadPayload: LooseObject = {};
  unreadArr.map((unread:string) => {
    unreadPayload[unread] = unread.length >= 6 && unreadPayload[unread] ? unreadPayload[unread] + 1 : 1;
  })
  return unreadPayload;
}
  
export const fetchUnreadCount = (dispatch: DispatchFunc) => async () => {
  const unreadArr:string[] = getCookieUnread();
  const unread = sortUnread(unreadArr);
  dispatch({
    type: 'setUnreadCount',
    payload: unread,
  })
};

export const setUnreadCount = (dispatch: DispatchFunc) => async (unreadString:string) => {
  setCookieUnread(unreadString);
  const unreadArr:string[] = getCookieUnread();
  const unread = sortUnread(unreadArr);
  dispatch({
    type: 'setUnreadCount',
    payload: {...unread},
  })
};

export const clearUnreadCountByType = (dispatch: DispatchFunc) => async (unreadString:string) => {
  filterCookieUnread(unreadString);
  const unreadArr:string[] = getCookieUnread();
  const unread = sortUnread(unreadArr);
  unread[unreadString] = 0;
  dispatch({
    type: 'setUnreadCount',
    payload: {...unread},
  })
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

export const fetchChannelDetails = (dispatch: DispatchFunc) => async (id:string) => {

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

export const fetchChannelHistory = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    storeFetched(id, data);
    dispatch({
      type: 'setMessageHistory',
      payload: data,
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Chat History failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };

  if (storedRecently(id)) {
    const data = getLocalStorage(id);
    dispatch({
      type: 'setMessageHistory',
      payload: data,
    });
  } else {
    executeApi('chatHistory', {token, id}, onSuccess, onError);
  }
}

export const sendChannelMessage = (dispatch: DispatchFunc) => async (id:string, text: string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {};
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Chat Message failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  executeApi('message', {token, text, id}, onSuccess, onError);
}

export const longPollMessages = (dispatch: DispatchFunc) => async (since:string) => {
  const token = getCookieToken();
  const onSuccess = (message:NnChatMessage) => {
    const id = message?.id || null;
    const channel = message?.channel || null;
    // add the message to the local storage 
    if (id !== null && channel !== null) {
      const messages = getLocalStorage(channel);
      const selectedChannel = messages && !isEmpty(messages) ? messages[0].channel : globalChannel;
      if (!messages.some((item:NnChatMessage) => item.id === id)) {
        messages.push(message);
        storeFetched(channel, messages);
        if(channel == selectedChannel) {
          dispatch({
            type: 'updateMessageHistory',
            payload: message,
          })
        }
        if(channel == alertChannel) {
          dispatch({
            type: 'setAnnouncement',
            payload: message,
          })
        }
      }
      setCookieUnread(channel);
      const unreadArr:string[] = getCookieUnread();
      const unread = sortUnread(unreadArr);
      dispatch({
        type: 'setUnreadCount',
        payload: {...unread},
      })
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