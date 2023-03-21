import executeApi from '@/utilites/executeApi';
import { 
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilites/cookieContext";
// import { storedRecently, getLocalStorage, storeFetched } from '@/utilites/localStorage';

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

export const fetchFactionUsers = (dispatch: DispatchFunc) => async (id:string) => {
  console.log(id)
}
export const removeUserFromFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
  console.log(faction, id)
}
export const addUserToFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
  console.log(faction, id)
}
export const adminUserToFaction = (dispatch: DispatchFunc) => (faction:string, id:string)  => {
  console.log(faction, id)
}