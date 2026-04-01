import executeApi from '@/utilities/executeApi';
import {
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilities/cookieContext";

export const fetchUnverifiedLocations = (dispatch: DispatchFunc) => async () => {
  fetchLocations(true, dispatch);
};

export const fetchAllLocations = (dispatch: DispatchFunc) => async () => {
  fetchLocations(false, dispatch);
};

const fetchLocations = (unverified: boolean, dispatch: DispatchFunc) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setLocations',
      payload: data ?? [],
    });
    return data;
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Locations failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('locations', { token, unverified }, onSuccess, onError);
};

export const fetchLocationById = (dispatch: DispatchFunc) => async (id: string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setLocation',
      payload: data,
    });
    return data;
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('location', { id, token }, onSuccess, onError);
};