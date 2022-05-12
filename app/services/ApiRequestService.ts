import { API_URL, APP_VERSIONS } from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class ApiRequestService {
    /**
     * Get API url
     */
    static getHost() {
        let host = API_URL;

        while (host[host.length - 1] === '/') {
            host = host.slice(0, host.length - 1);
        }

        return host;
    }

    /**
     * Make request headers
     */
    private static async makeHeaders() {
        let headers = {
            Accept: 'application/json',
            'Accept-Language': 'en', //DEBUG ? 'en' : 'nl',
            'locale': 'en', //DEBUG ? 'en' : 'nl',
            'Content-Type': 'application/json',
            'Client-Version': APP_VERSIONS[Platform.OS] || 'error',
            'Client-Platform': Platform.OS,
            Authorization: 'Bearer ' + (await AsyncStorage.getItem('access_token')),
        };

        return headers;
    }

    /**
     * Make GET Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static get(
        endpoint: string,
        data: any = {},
        headers: any = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('GET', endpoint, data, headers, callback);
    }

    /**
     * Make POST Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static post(
        endpoint: string,
        data: any = {},
        headers: any = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('POST', endpoint, data, headers, callback);
    }

    /**
     * Make PATCH Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static patch(
        endpoint: string,
        data: any = {},
        headers: any = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('PATCH', endpoint, data, headers, callback);
    }

    /**
     * Make PUT Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static put(
        endpoint: string,
        data: any = {},
        headers: any = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('PUT', endpoint, data, headers, callback);
    }

    /**
     * Make DELETE Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static _delete(
        endpoint: string,
        data: any = {},
        headers: any = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('DELETE', endpoint, data, headers, callback);
    }

    /**
     * Make AJAX Request
     *
     * @param method
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static ajax(
        method: string,
        endpoint: string,
        data: any = {},
        headers: any = {},
        callback = (_callback: any) => _callback,
    ) {
        return new Promise(async (resolve, reject) => {
            let getQueryString = '';
            let params = {
                method: method,
                headers: Object.assign(await this.makeHeaders(), headers),
            };

            Object.keys(params.headers).forEach((key) => {
                if (params.headers[key] === undefined) {
                    delete params.headers[key];
                }
            });

            if (typeof data === 'object' && !(data instanceof FormData)) {
                data = { ...data };
            }

            if (method === 'GET') {
                getQueryString = this.dataToGetQueryString(data);
            } else {
                params = { ...params, ...{ body: JSON.stringify(data) } };
            }

            params = callback(params);

            console.log(this.endpointToUrl(endpoint, getQueryString));

            fetch(this.endpointToUrl(endpoint, getQueryString), params).then(async (res) => {
                let _data = await res.text();

                try {
                    _data = JSON.parse(_data);
                } catch (e) {}

                let resData = {
                    status: res.status,
                    data: _data,
                    response: res,
                };

                if (res.status === 200 || res.status === 201 || res.status === 204) {
                    resolve(resData);
                } else {
                    reject(resData);
                }
            });
        });
    }

    /**
     * Build GET query paramethers string
     *
     * @param data
     */
    private static dataToGetQueryString(data: any) {
        let props = Object.keys(data);
        let queryParams: Array<string> = [];

        props.forEach((prop: string) => {
            if (Array.isArray(data[prop])) {
                data[prop + '[]'] = data[prop];
                queryParams.push(prop + '=' + data[prop]);
                delete data[prop];
            } else {
                queryParams.push(prop + '=' + data[prop]);
            }
        });

        return queryParams.length > 0 ? '?' + queryParams.join('&') : '';
    }

    /**
     * @param endpoint
     */
    static endpointToUrl(endpoint: string, getParamsString: string) {
        return this.getHost() + (endpoint || '') + getParamsString;
    }
}

export default ApiRequestService;
