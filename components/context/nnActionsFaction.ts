import executeApi from '@/utilites/executeApi';
import { 
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilites/cookieContext";
// import { storedRecently, getLocalStorage, storeFetched } from '@/utilites/localStorage';

export const fetchAllFactions = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setFactions',
      payload: data,
    });
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Factions List failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionsList', {token}, onSuccess, onError);
}


export const fetchUserFactions = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setUserFactions',
      payload: data,
    });
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Factions failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factions', {token}, onSuccess, onError);
}

export const fetchFactionDetails = (dispatch: DispatchFunc) => async (id:string) => {
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
    const { message = 'Faction failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionProfile', {id, token}, onSuccess, onError);
}

export const removeUserFromFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
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
    const { message = 'Faction leave error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionLeave', {faction, id,  token}, onSuccess, onError);
}

export const addUserToFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
  const token = getCookieToken();
  const onSuccess = (response:APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'success', message: "Invite Sent.", show: true},
    })
    return data;
  };
  const onError = (err:netcheckAPIResData) => {
    const { message = 'Faction invite error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionInvite', {faction, id,  token}, onSuccess, onError);
}

export const joinFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
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
    const { message = 'Faction join error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionJoin', {faction, id,  token}, onSuccess, onError);
}

export const addRepToFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
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
    const { message = 'Faction add rep error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionAddRep', {faction, id,  token}, onSuccess, onError);
}

export const removeRepToFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
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
    const { message = 'Faction remove rep error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionRemoveRep', {faction, id,  token}, onSuccess, onError);
}

export const factionUpdateProfile = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
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
    const { message = 'Faction remove rep error.' } = err;
    dispatch({
      type: 'setAlert',
      payload: {severity: 'error', message, show: true},
    })
    return err;
  };
  executeApi('factionUpdateProfile', {faction, id,  token}, onSuccess, onError);
}