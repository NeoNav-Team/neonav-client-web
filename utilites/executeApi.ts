import axios from 'axios';
import { apiUrl, authApiEnpoints } from '../utilites/constants';

const executeAPI = (endpoint:string, data:any, callback: any, errBack: any):Promise<any> => {
    const axiosDefaults:any = axios.defaults;
    let headers = {};
    if(data?.token) {
        headers = {
            'content-type': 'application/json',
            'x-access-token': `${data?.token}`
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
    console.log('data', data);
    return axios({
        method,
        url,
        data,
        headers
    }).then(
        function (response:any) {
            callback && callback(response)
        }
    ).catch(function (error:any) {
        if (error.response) {
            console.log('Error', error.response.data)
            errBack && errBack(error.response.data);
        } else if (error.request) {
            console.log('Error', error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log('Error', error.config);
        return error;
      });
}

export default executeAPI;