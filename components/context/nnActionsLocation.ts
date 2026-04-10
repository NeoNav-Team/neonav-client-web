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
      type: 'updateLocation',
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

export const createFactionLocation = (dispatch: DispatchFunc) => async (faction:string, payload:any) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Created", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('createFactionLocation', { faction, ...payload, token }, onSuccess, onError);
};

export const createLocation = (dispatch: DispatchFunc) => async (payload:any) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Created", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('createLocation', { ...payload, token }, onSuccess, onError);
};

export const updateFactionLocation = (dispatch: DispatchFunc) => async (id:string, faction:string, payload:any) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Updated", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('updateFactionLocation', { id, faction, ...payload, token }, onSuccess, onError);
};

export const updateLocation = (dispatch: DispatchFunc) => async (id:string, payload:any) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Updated", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('updateLocation', { id, ...payload, token }, onSuccess, onError);
};

export const deleteLocation = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Deleted", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('deleteLocation', { id, token }, onSuccess, onError);
};

export const verifyLocation = (dispatch: DispatchFunc) => async (id:string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Verified", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('verifyLocation', { id, token }, onSuccess, onError);
};

export const addLocationReview = (dispatch: DispatchFunc) => async (id:string, review:any) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Review Added", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('addLocationReview', { id, ...review, token }, onSuccess, onError);
};

export const deleteLocationReview = (dispatch: DispatchFunc) => async (reviewid:string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Review Deleted", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('deleteLocationReview', { reviewid, token }, onSuccess, onError);
};

export const addLocationPin = (dispatch: DispatchFunc) => async (lat:string, long:string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "Location Pin Added", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('addLocationPin', { lat, long, token }, onSuccess, onError);
};

export const fetchLocationPins = (dispatch: DispatchFunc) => async (user:string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setLocationPins',
      payload: data ?? [],
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
  executeApi('getLocationPins', { user, token }, onSuccess, onError);
};

export const deleteLocationPins = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: "All Location Pins Deleted", show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Location failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
    return err;
  };
  executeApi('deleteLocationPins', { token }, onSuccess, onError);
};