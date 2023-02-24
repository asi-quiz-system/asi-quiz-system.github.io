import { clearUserData, setUserData } from '../util.js';
import { get, post } from './api.js';

export async function register(email, username, password) {
    const { sessionToken, objectId } = await post('/users', { email, username, password });

    const userData = {
        objectId,
        sessionToken,
        email,
        username
    };
    setUserData(userData);
}

export async function login(email, password) {
    const { username, objectId, sessionToken } = await post('/login', { email, password });

    const userData = {
        objectId,
        sessionToken,
        email,
        username
    };
    setUserData(userData);
}

export async function getUserById(id) {
    return get(`/users/${id}`);
}

export async function logout() {
    // const result = get('/logout');
    clearUserData();
}