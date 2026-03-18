import executeApi from '@/utilities/executeApi';
import {
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilities/cookieContext";

export const fetchAllLocations = (dispatch: DispatchFunc) => async () => {
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
  executeApi('locations', { token }, onSuccess, onError);
};
