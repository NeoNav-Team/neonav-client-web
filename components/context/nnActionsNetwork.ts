import executeApi from '@/utilites/executeApi';
import { 
    APIResponse,
    DispatchFunc,
    netcheckAPIResData,
} from "./nnTypes";
import { getCookieToken, getCookieContext, setCookieContext } from "@/utilites/cookieContext";
import { getLocalStorage, setLocalStorage } from "@/utilites/localStorage";

export const initContext = (dispatch: DispatchFunc) => async () => {
    let onLoadUserContext = {};
    const cookieContextData = getCookieContext();
    const storedCollections = getLocalStorage('nnCollection')
    if (Object.keys(cookieContextData).length === 0) {
      // creates nnContext cookie if one does not exist
      const cookieJWTData = getCookieToken();
      const cookieDataArr = cookieJWTData.split('.');
      const cookieDataObj =  JSON.parse(window.atob(cookieDataArr[1]));
      //creates empt default context with just the userID
      const jwtContext =  {
          network: {
          selected:{
            account: cookieDataObj.id,
          },
          collections: {
            transactions: [
              {
                id: cookieDataObj.id,
                collection: [],
              }
            ]
          }
        },
        user: {
          auth: {
            userid: cookieDataObj.id,
          }
        }
      };
      onLoadUserContext = merge.all([onLoadUserContext, defaultNnContext, jwtContext]);
      setCookieContext(onLoadUserContext);
    } else {
      const collectionContext =  {
        network: {
          collections: storedCollections
        }
      };
      onLoadUserContext = merge.all([onLoadUserContext, cookieContextData, collectionContext]);
    }
    //dispatches context to state
    dispatch({
      type: 'initContext',
      payload: onLoadUserContext,
    })
  }
  
  export const closeAlert = (dispatch: DispatchFunc) => async () => {
    dispatch({
      type: 'setAlert',
      payload: {show: false},
    })
  };
  
  export const fetchNetworkStatus = (dispatch: DispatchFunc) => async () => {
    const onSuccess = (response:APIResponse) => {
      dispatch({
        type: 'setNetwork',
        payload: response?.data?.message,
      })
    };
    const onError = (err:object) => {
      dispatch({
        type: 'setNetwork',
        payload: 'offline',
      })
    };
    executeApi('netCheck', {}, onSuccess, onError);
  }