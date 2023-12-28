import executeApi from '@/utilities/executeApi';
import longPollApi from '@/utilities/longPollApi';
import { 
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
  NnChatMessage,
} from "./nnTypes";
import { getCookieToken } from "@/utilities/cookieContext";
import { globalChannel } from '@/utilities/constants';
import { storedRecently, getLocalStorage, clearLocalStorage, storeFetched } from '@/utilities/localStorage';

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
    })
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
      const selectedChannel = messages ? messages[0].channel : globalChannel;
      if (!messages.some((item:NnChatMessage) => item.id === id)) {
        messages.push(message);
        storeFetched(channel, messages);
        if(channel == selectedChannel) {
          dispatch({
            type: 'updateMessageHistory',
            payload: message,
          })
        }
      }
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

export const joinUserToChannel  = (dispatch: DispatchFunc) => async (channel:string) => {
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