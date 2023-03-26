import axios, { AxiosError, AxiosResponse } from 'axios';
import { apiUrl, authApiEnpoints } from '../utilites/constants';

const WAIT_TIME = 30000;

const newAbortSignal = (timeoutMs:number) => {
  const abortController = new AbortController();
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
  ).catch(function (error:AxiosError) {
    (error:AxiosResponse) => {
      return error;
    }
  });
  if (
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
    console.log('since', since);
    await longPollApi(endpoint, newData, callback, errBack);
  }
}

export default longPollApi;