import executeApi from '@/utilities/executeApi';
import {
  APIResponse,
  DispatchFunc,
  netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken } from "@/utilities/cookieContext";

export const fetchAllEvents = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEvents',
      payload: data ?? [],
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Events failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
  };
  executeApi('eventsAll', { token }, onSuccess, onError);
};

export const fetchUserEventsAttending = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEvents',
      payload: data ?? [],
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Events failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
  };
  executeApi('userEventsAttending', { token }, onSuccess, onError);
};

export const fetchUserEventsMine = (dispatch: DispatchFunc) => async () => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEvents',
      payload: data ?? [],
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Events failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
  };
  executeApi('userEventsMine', { token }, onSuccess, onError);
};

export const fetchLocationEvents = (dispatch: DispatchFunc) => async (locationId: string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    const { data } = response;
    dispatch({
      type: 'setEvents',
      payload: data ?? [],
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'Events failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
  };
  executeApi('locationEvents', { location: locationId, token }, onSuccess, onError);
};

export const rsvpEvent = (dispatch: DispatchFunc) => async (eventId: string) => {
  const token = getCookieToken();
  const onSuccess = (response: APIResponse) => {
    dispatch({
      type: 'setAlert',
      payload: { severity: 'success', message: 'RSVP updated', show: true },
    });
  };
  const onError = (err: netcheckAPIResData) => {
    const { message = 'RSVP failure' } = err;
    dispatch({
      type: 'setAlert',
      payload: { severity: 'error', message, show: true },
    });
  };
  executeApi('eventRsvp', { id: eventId, token }, onSuccess, onError);
};
