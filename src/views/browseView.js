import { html } from '../lib/lit-html.js';
import {repeat } from '../lib/directives/repeat.js';
import * as quizService from '../data/quiz.js'
import { createSubmitHandler } from '../util.js';


export async function showBrowse(ctx) {
    ctx.render(browseTemplate());

    const query = ctx.query.search;
    

    if (query) {
        const search = Object.fromEntries(query
        .split('+')
        .map(el => el.split(':')));
        
        const [{ results: quizzes }, {results: taken}] = await Promise.all([
             quizService.search(search.title, search.topic),
             quizService.getAllStat()
            ]);
            
        ctx.render(browseTemplate(quizzes, taken));
    } else {
        const [{ results: quizzes }, {results: taken}] = await Promise.all([
            quizService.getAll(),
            quizService.getAllStat()
        ]);


        ctx.render(browseTemplate(quizzes, taken));
    }

    function browseTemplate(quizzes, taken) {
        return html`
        <section id="browse">
            <header class="pad-large">
                <form class="browse-filter" @submit=${createSubmitHandler(onSearch)}>
                    <input class="input" type="text" name="title">
                    <select class="input" name="topic">
                        <option value="all">All Categories</option>
                        <option value="general">General</option>
                        <option value="languages">Languages</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Tools and Software</option>
                    </select>
                    <input class="input submit action" type="submit" value="Filter Quizzes">
                </form>
                <h1>All quizes</h1>
            </header>
        
            ${quizzes
                ? html`<div class="pad-large alt-page">
                    ${repeat(quizzes, q => q.objectId, q => createCard(q ,taken))}
                </div>` 
                : loading()}

        </section>`
    }

    function onSearch({title, topic}) {

        if(!title && topic == 'all') {
            return ctx.page.redirect('/browse');
        }
        
        ctx.page.redirect('/browse?search=title:' + title + '%2Btopic:' + topic);
    }

}

function createCard(quiz, taken) {
    return html`
    <article class="preview layout">
                    <div class="right-col">
                        <a class="action cta" href="/view/${quiz.objectId}">View Quiz</a>
                    </div>
                    <div class="left-col">
                        <h3><a class="quiz-title-link" href="/view/${quiz.objectId}">${quiz.title}</a></h3>
                        <span class="quiz-topic">Topic: ${quiz.topic}</span>
                        <div class="quiz-meta">
                            <span>${quiz.questionCount} questions</span>
                            <span>|</span>
                            <span>Taken ${taken.find( e => e.quiz.objectId == quiz.objectId).taken} times</span>
                        </div>
                    </div>
                </article>`
}

function loading() {
    return html`
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
    </div>`
}