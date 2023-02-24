import * as quizService from '../data/quiz.js';
import * as questionService from '../data/question.js';
import * as answersService from '../data/answers.js';
import {getUserById} from '../data/user.js'
import { html } from '../lib/lit-html.js';

export function preloadAnswers(param) {
    return async function (ctx, next) {
        const id = ctx.params[param];

        ctx.render(html`
                <div class="pad-large alt-page async">
                    <div class="sk-cube-grid">
                        <div class="sk-cube sk-cube1"></div>
                        <div class="sk-cube sk-cube2"></div>
                        <div class="sk-cube sk-cube3"></div>
                        <div class="sk-cube sk-cube4"></div>
                        <div class="sk-cube sk-cube5"></div>
                        <div class="sk-cube sk-cube6"></div>
                        <div class="sk-cube sk-cube7"></div>
                        <div class="sk-cube sk-cube8"></div>
                        <div class="sk-cube sk-cube9"></div>
                    </div>
                </div>`);

        const results = await answersService.getById(id);

        ctx.data = results;

        const { results: questions } = await questionService.getByQuizId(results.quiz.objectId);
        ctx.questions = questions;

        next();
    }
}

export function preloadProfile(param) {
    return async function (ctx, next) {

        const id = ctx.params[param];

        ctx.render(html`
            <div class="pad-large alt-page async">
                <div class="sk-cube-grid">
                    <div class="sk-cube sk-cube1"></div>
                    <div class="sk-cube sk-cube2"></div>
                    <div class="sk-cube sk-cube3"></div>
                    <div class="sk-cube sk-cube4"></div>
                    <div class="sk-cube sk-cube5"></div>
                    <div class="sk-cube sk-cube6"></div>
                    <div class="sk-cube sk-cube7"></div>
                    <div class="sk-cube sk-cube8"></div>
                    <div class="sk-cube sk-cube9"></div>
                </div>
            </div>`);

        const [{ results: quizzes }, { results: results }, author, {results : solutions}] = await Promise.all([
            quizService.getQuizByUserId(id),
            quizService.getAllStat(),
            getUserById(id),
            ctx.isCurrentUser && answersService.getByUserId(ctx.user.objectId)
        ]);

        ctx.data = quizzes;
        ctx.results = results;
        ctx.author = author;
        solutions ? ctx.solutions = solutions : null;

        next();
    }
}

export function preloadQuiz(param) {
    return async function (ctx, next) {
        const id = ctx.params[param];
        if (id) {

            ctx.render(html`
            <div class="pad-large alt-page async">
                <div class="sk-cube-grid">
                    <div class="sk-cube sk-cube1"></div>
                    <div class="sk-cube sk-cube2"></div>
                    <div class="sk-cube sk-cube3"></div>
                    <div class="sk-cube sk-cube4"></div>
                    <div class="sk-cube sk-cube5"></div>
                    <div class="sk-cube sk-cube6"></div>
                    <div class="sk-cube sk-cube7"></div>
                    <div class="sk-cube sk-cube8"></div>
                    <div class="sk-cube sk-cube9"></div>
                </div>
            </div>`);

            const [data, questions, taken] = await Promise.all([
                quizService.getById(id),
                questionService.getByQuizId(id),
                quizService.getStatByQuizId(id)
            ]);

            ctx.taken = taken.results[0];
            ctx.data = data;
            ctx.questions = questions;
        }

        next();
    }
}

export function preloadCount() {
    return async function (ctx, next) {

        const [quizData, questionData] = await Promise.all([
            quizService.getAllCount(),
            questionService.getAllCount()
        ]);

        ctx.quizCount = quizData.count;
        ctx.questionCount = questionData.count;

        next();
    }
}

export function preloadLastQuiz() {
    return async function (ctx, next) {

        const data = await quizService.getNewest();

        const taken = await quizService.getStatByQuizId(data.results[0].objectId);

        ctx.quiz = data.results[0];

        ctx.taken = taken.results[0].taken;

        next();
    }
}