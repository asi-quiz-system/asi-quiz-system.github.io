import { del, get, post, put } from './api.js';
import { addOwner, createPointer, encodeObject, filterRelation } from '../util.js';


const endpoints = {
    'taken': '/classes/quizStats',
    'statsByQuizId': (quizId) => '/classes/quizStats?where=' + encodeObject(filterRelation('quiz', 'quiz', quizId)),
    'quizzes': '/classes/quiz',
    'quizByUserId': (userId) => '/classes/quiz?where=' + encodeObject(filterRelation('owner', '_User', userId)),
    'count': '/classes/quiz?count=1',
    'last': '/classes/quiz?order=-createdAt&limit=1',
    'search': (title, topic) => {
        if (topic != 'all') {
            return '/classes/quiz?where=' + encodeURIComponent(`{"title": {"$regex": "${title.split('').map(e => `${e.toLowerCase()}|${e.toUpperCase()}`).join('')}"}, "topic": "${topic}"}`);
        } else {
            return '/classes/quiz?where=' + encodeURIComponent(`{"title": {"$regex": "${title.split('').map(e => `${e.toLowerCase()}|${e.toUpperCase()}`).join('')}"}}`);
        }
    }
}

export async function createStat(quizId) {
    return post(endpoints.taken, { quiz: createPointer('quiz', quizId) });
}

export async function getStatByQuizId(quizId) {
    return get(endpoints.statsByQuizId(quizId));
}

export async function getQuizByUserId(userId) {
    return get(endpoints.quizByUserId(userId));
}

export async function getAllStat() {
    return get(endpoints.taken);
}

export async function updateStat(statId, quizId, taken) {
    return put(endpoints.taken + '/' + statId, { taken, quiz: createPointer('quiz', quizId) });
}

export async function getAll() {
    return get(endpoints.quizzes);
}

export async function search(title, topic) {
    return get(endpoints.search(title, topic));
}

export async function getNewest() {
    return get(endpoints.last);
}

export async function getAllCount() {
    return get(endpoints.count);
}

export async function create(quizData, userId) {
    return post(endpoints.quizzes, addOwner(quizData, userId));
}

export async function getById(id) {
    return get(endpoints.quizzes + '/' + id);
}

export async function deleteById(id) {
    return del(endpoints.quizzes + '/' + id);
}

export async function deleteStatById(id) {
    return del(endpoints.taken + '/' + id);
}

export async function update(id, quizData, userId) {
    return put(endpoints.quizzes + '/' + id, addOwner(quizData, userId));
}
