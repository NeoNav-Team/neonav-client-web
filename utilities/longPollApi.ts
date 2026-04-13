import axios, { AxiosResponse } from 'axios';
import { apiUrl, authApiEnpoints } from '../utilities/constants';

const WAIT_TIME = 300000;

let activeAbortController: AbortController | null = null;

export const abortLongPoll = () => {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
};

const newAbortSignal = (timeoutMs:number) => {
  const abortController = new AbortController();
  activeAbortController = abortController;
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
}

const longPollApi = async (endpoint:string, data:any, callback: any, errBack: any):Promise<any> => {
  if (typeof data === 'undefined') {
    return;
  }
  const axiosDefaults:any = axios.defaults;
  let headers = {};
  const token = data?.token;
  if (typeof data.since === 'undefined') {
    data.since = 'now';
  }
  if(data?.token) {
    headers = {
      'content-type': 'application/json',
      'x-access-token': `${token}`
    };
    delete data.token;
  }
  axiosDefaults.port = apiUrl.port;
  const { path, method } = (authApiEnpoints as any)[endpoint];
  let templatedPath = path;
  data && Object.keys(data).forEach((key:string) => {
    const inTemplate = templatedPath.indexOf(`$${key}`) !== -1;
    templatedPath = templatedPath.replace(`$${key}`, data[key])
    inTemplate && delete data[key];
  });
  const url = `${apiUrl.protocol}://${apiUrl.hostname}${templatedPath}`;
  const currentSince = data.since;
  let networkError = false;
  const longPollResponse:any = await axios({
    method,
    url,
    data,
    headers,
    timeout: WAIT_TIME,
    signal: newAbortSignal(WAIT_TIME)
  }).then(
    (response:AxiosResponse) => {
      return response;
    }
  ).catch(function () {
    networkError = true;
    return undefined;
  });
  if (networkError || typeof longPollResponse === 'undefined') {
    // Network error or abort — restart from last known sequence after brief delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    await longPollApi(endpoint, {since: currentSince, token}, callback, errBack);
  } else if (
    typeof longPollResponse !== 'undefined' &&
        typeof longPollResponse?.status !== 'undefined' &&(
      longPollResponse?.status === 403 ||
        longPollResponse?.status === 401
    )) {
    errBack ? errBack(longPollResponse) : null;
  } else if (
    typeof longPollResponse !== 'undefined' && 
        typeof longPollResponse?.status !== 'undefined' &&
        longPollResponse?.status === 502) {
    let newData = {since:'now', token};
    await longPollApi(endpoint, newData, callback, errBack);
  } else if (
    typeof longPollResponse !== 'undefined' &&
        typeof longPollResponse?.status !== 'undefined' &&
        longPollResponse?.status !== 200) {
    // An error - let's show it
    errBack ? errBack(longPollResponse) : null;
    // Reconnect
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    let newData = {since:'now', token};
    await longPollApi(endpoint, newData, callback, errBack);
  } else {
    // Get and show the message

    callback(longPollResponse?.data[1]);
    // Call longPollResponseMessages() again to get the next message
    const since = longPollResponse?.data[0];
    let newData = {since, token};
    await longPollApi(endpoint, newData, callback, errBack);
  }
}

export default longPollApi;