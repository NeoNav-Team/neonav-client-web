'use client';
import DataContextCreator from "./dataContextCreator";
import { NnProviderValues } from "./nnTypes";

type ActionTypes = 'setNetwork';

interface Action {
  type: ActionTypes,
  payload?: Object,
}

type DispatchFunc = (dispatch: Action) => void;

const defaultNnContext = {
  network: { 
    location: 'loading...'
  },
  users: {},
};

export const nnReducer = (state:NnProviderValues, action: Action) => {
  const {payload = null, type = null} = action;
  switch (type) {
    case 'setNetwork':
      return {
        ...state,
        network: { location: payload }
      }
  }
};

export const fetchNetworkStatus = (dispatch: DispatchFunc) => async () => {
  const networkRestUrl = 'https://api.neonav.net/api/auth/netcheck'
  const resData = await fetch(networkRestUrl);
  const payloadData = await resData.json();
  if(typeof payloadData !== 'undefined') {
    dispatch({
      type: 'setNetwork',
      payload: 'offline',
    })
  }
  if(payloadData.message) {
    dispatch({
      type: 'setNetwork',
      payload: payloadData.message,
    })
  }
}

export const { Context, Provider } = DataContextCreator(
  nnReducer,
  { fetchNetworkStatus },
  defaultNnContext,
);