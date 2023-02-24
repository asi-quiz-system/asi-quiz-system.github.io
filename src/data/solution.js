import { addOwnerQuestionQuiz, encodeObject, filterRelation } from '../util.js';
import { del, get, post, put } from './api.js';

const endpoints = {
    'solution' : '/classes/solution',
    'getByQuestion' : (questionId) => '/classes/solution?where=' + encodeObject(filterRelation('question', 'question', questionId)),
    'getByQuiz' : (quizId) => '/classes/solution?where=' + encodeObject(filterRelation('quiz', 'quiz', quizId)),
    'getByUser' : (userId) => '/classes/solution?where=' + encodeObject(filterRelation('owner', '_User', userId)),
};


export async function getByQuestionId(id) {
    return get(endpoints.getByQuestion(id));
}

export async function getByQuizId(id) {
    return get(endpoints.getByQuiz(id));
}

export async function getByUserId(id) {
    return get(endpoints.getByUser(id));
}

export async function create(solutionData, userId, questionId, quizId) {
    return post(endpoints.solution, addOwnerQuestionQuiz(solutionData, userId, questionId, quizId));
}

export async function update(id, solutionData, userId, quizId) {
    return put(endpoints.solution + '/' + id, addOwnerQuestionQuiz(solutionData, userId, id, quizId));
}

export async function remove(id) {
    return del(endpoints.solution + '/' + id);
}
