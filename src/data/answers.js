import { addOwnerQuiz, encodeObject, filterRelation } from '../util.js';
import { get, post } from './api.js';

const endpoints = {
    'answers' : '/classes/answers',
    'answersById' : (id) => '/classes/answers/' + id + '?include=quiz',
    'answersByUserId' : (userId) => '/classes/answers?where=' + encodeObject(filterRelation('owner', '_User', userId)) + '&include=quiz',
};

export async function getById(id) {
    return get(endpoints.answersById(id));
}

export async function getByUserId(id) {
    return get(endpoints.answersByUserId(id));
}

export async function create(answerData, userId, quizId) {
    return post(endpoints.answers, addOwnerQuiz(answerData, userId, quizId));
}
