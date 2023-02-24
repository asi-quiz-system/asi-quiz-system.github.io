import { getUserData } from '../util.js';

const host = 'https://parseapi.back4app.com';
const appId = 'mjfqLstS5tvWZj6MlnB3lnlSTTq2tELkV9OhHAZW';
const apiKey = 'OK31aBBasRgQ6k6eiwURO21H8d83WZIc9QWSSuwC';

async function request(method, url = '/', data) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-JavaScript-Key': apiKey
        }
    };

    if (data !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = getUserData();

    if(userData) {
        options.headers['X-Parse-Session-Token'] = userData.sessionToken;
    }

    try {
        const response = await fetch(host + url, options);

        if (response.status == 204) {
            return response;
        }

        const result = await response.json();

        if (response.ok != true) {
            throw new Error(result.message || result.error);
        }
 
        return result;
    } catch (err) {

    }
}

export const get = request.bind(null, 'get');
export const post = request.bind(null, 'post');
export const put = request.bind(null, 'put');
export const del = request.bind(null, 'delete');