export const ENVIRONMENT = 'local';
//export const API_URL = 'https://pike.rminds.dev/api';
export const DEBUG = false; //__DEV__ || ENVIRONMENT.toString() !== 'prod';
export const API_URL = {
    local: 'http://192.168.1.105:9100/api',
    dev: 'http://notes-web.com/api',
    prod: '',
}[ENVIRONMENT];
export const POOL_INTERVAL = 7500;
export const APP_VERSIONS = {
    android: 1,
    ios: 1,
};
