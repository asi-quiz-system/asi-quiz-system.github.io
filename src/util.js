import * as quizService from './data/quiz.js';
import * as questionService from './data/question.js';
import * as solutionService from './data/solution.js';

export function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function clearUserData() {
    sessionStorage.removeItem('userData');
}

export function createPointer(className, objectId) {
    return { __type: 'Pointer', className, objectId }
}

export function addOwner(record, ownerId) {
    const data = Object.assign({}, record);
    data.owner = createPointer('_User', ownerId);

    return data;
}

export function addOwnerQuestion(record, ownerId, questionId) {
    const data = Object.assign({}, record);
    data.owner = createPointer('_User', ownerId);
    data.question = createPointer('question', questionId);

    return data;
}

export function addOwnerQuestionQuiz(record, ownerId, questionId, quizId) {
    const data = Object.assign({}, record);
    data.owner = createPointer('_User', ownerId);
    data.question = createPointer('question', questionId);
    data.quiz = createPointer('quiz', quizId);

    return data;
}

export function addOwnerQuiz(record, ownerId, quizId) {
    const data = Object.assign({}, record);
    data.owner = createPointer('_User', ownerId);
    data.quiz = createPointer('quiz', quizId);

    return data;
}

export function filterRelation(field, collection, objectId) {
    return {
        [field]: createPointer(collection, objectId)
    };
}

export function encodeObject(obj) {
    return encodeURIComponent(JSON.stringify(obj));
}

export function encodeDate(date) {
    return { __type: 'Date', iso: date.toISOString() };
}

export function createSubmitHandler(callback) {
    return function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries([...formData].map(([k, v]) => [k, v.trim()]));

        callback(data, event);
    }
}

export async function deleteQuiz(id) {

    const [{ results: questions }, { results: solutions }, { results: quizStats }] = await Promise.all([
        questionService.getByQuizId(id),
        solutionService.getByQuizId(id),
        quizService.getStatByQuizId(id)
    ]);

    console.log(questions);
    console.log(solutions);
    console.log(quizStats);

    await Promise.all([
        questions.forEach(q => questionService.remove(q.objectId)),
        solutions.forEach(s => solutionService.remove(s.objectId)),
        quizStats.forEach(s => quizService.deleteStatById(s.objectId)),
        quizService.deleteById(id)
    ]);

}