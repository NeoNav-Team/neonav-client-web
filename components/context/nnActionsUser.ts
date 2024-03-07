import executeApi from '@/utilities/executeApi';
import { 
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from '@/utilities/cookieContext';
import { clearLocalStorage } from '@/utilities/localStorage';
import { storedRecently, getLocalStorage, storeFetched } from '@/utilities/localStorage';

export const addRecentScan = (dispatch: DispatchFunc) => async (body:any) => {
  const data = body;
  dispatch({
    type: 'setRecentlyScanned',
    payload: data,
  });
};

export const fetchUserProfile = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEntity',
      payload: data,
    });
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    console.log('err', err);
    const { message = 'Profile failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('profile', {token}, onSuccess, onError);
}

//TODO: remove any of document
export const updateUserProfile = (dispatch: DispatchFunc) => async (doc:any, profile: any) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEntity',
      payload: data,
    });
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    console.log('err', err);
    const { message = 'Profile failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('profileUpdate', {...doc, profile, token}, onSuccess, onError);
}

export const fetchContact = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEntity',
      payload: data,
    });
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Contact failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  const requestId = id;
  executeApi('identify', {requestId, token}, onSuccess, onError);
}

export const befriend = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('lastFetch_contacts');
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message:'Friendship created!', show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Could not befriend this person.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('befriend', {id, token}, onSuccess, onError);
}


export const unfriend = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('lastFetch_contacts');
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message:'Bye, Felicia.', show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Unfriend failure. Maybe try couples therapy?' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('unfriend', {id, token}, onSuccess, onError);
}

export const fetchUserContacts = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    storeFetched('contacts', data);
    dispatch({
      type: 'setUserContacts',
      payload: data,
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Contact failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };

  if (storedRecently('contacts')) {
    const data = getLocalStorage('contacts');
    dispatch({
      type: 'setUserContacts',
      payload: data,
    })
  } else {
    executeApi('contacts', {token}, onSuccess, onError);
  }
}

export const fetchUserStatuses = (dispatch: DispatchFunc) => async (id: string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('statuses');
    dispatch({
      type: 'setUserStatuses',
      payload: data,
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Status failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  executeApi('statuses', {token, id}, onSuccess, onError);
}

export const setUserStatus = (dispatch: DispatchFunc) => async (id: string, body:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    const { message } = data;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message, show: true},
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Status failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  executeApi('statusSet', {id, body, token}, onSuccess, onError);
}
export const setUserHiddenStatus = (dispatch: DispatchFunc) => async (id:string, body: string, faction?:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    const { message } = data;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message, show: true},
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Status failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  if (faction){
    executeApi('factionHiddenStatusSet', {token, id, body, faction}, onSuccess, onError);
  } else {
    executeApi('hiddenStatusSet', {id, body, token}, onSuccess, onError);
  }
}
export const fetchUserSetStatuses = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('statuses');
    dispatch({
      type: 'setUserStatuses',
      payload: data,
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Status failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  executeApi('statusesSet', {id, token}, onSuccess, onError);
}

export const toggleStatusClass = (dispatch: DispatchFunc) => async (id: string, faction?:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    const { message } = data;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message, show: true},
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Status failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  if (faction){
    executeApi('toggleFactionStatusScope', {id, faction, token}, onSuccess, onError);
  } else {
    executeApi('toggleStatusScope', {id, token}, onSuccess, onError);
  }
}

export const removeStatus = (dispatch: DispatchFunc) => async (id: string, faction?:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    const { message } = data;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message, show: true},
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Status failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  if (faction) {
    executeApi('factionStatusRemove', {id, faction, token}, onSuccess, onError); 
  } else{
    executeApi('statusRemove', {id, token}, onSuccess, onError);
  }
}

export const userSearch = (dispatch: DispatchFunc) => async (query:string) => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    clearLocalStorage('entityUsers');
    dispatch({
      type: 'setEntityUserlist',
      payload: data,
    })
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Search failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
  };
  executeApi('searchUsers', {query, token}, onSuccess, onError);
}