import { addOwner, createPointer, encodeObject, filterRelation } from '../util.js';
import { del, get, post, put } from './api.js';

const endpoints = {
    'questionByQuizId': (quizId) => '/classes/question?where=' + encodeObject(filterRelation('quiz', 'quiz', quizId)) + '&include=owner',
    'question': (quizId, skip) => '/classes/question?where=' + encodeObject(filterRelation('quiz', 'quiz', quizId)) + '&count=1' + '&limit=1' + `&skip=${skip}`,
    'questions': '/classes/question',
    'count': '/classes/question?count=1'
}

export async function getAllCount() {
    return get(endpoints.count);
}

export async function getByQuizId(quizId) {
    return await get(endpoints.questionByQuizId(quizId));
}

export async function create(questionData, quiz, userId) {
    questionData.quiz = createPointer('quiz', quiz);
    questionData = addOwner(questionData, userId);
    return post(endpoints.questions, questionData);
}

export async function getQuestion(quizId, num) {
    return await get(endpoints.question(quizId, num - 1));
}

export async function remove(id) {
    return del(endpoints.questions + '/' + id);
}

export async function getById(id) {
    return get(endpoints.questions + '/' + id);
}

export async function update(id, questionData, quiz, userId) {
    questionData.quiz = createPointer('quiz', quiz);
    questionData = addOwner(questionData, userId);
    return put(endpoints.questions + '/' + id, questionData);
}
