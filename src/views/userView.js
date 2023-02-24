import { html, nothing } from '../lib/lit-html.js';
import {repeat } from '../lib/directives/repeat.js';
import { deleteQuiz } from '../util.js';


export async function showUser(ctx) {

    const quizzes = ctx.data;
    const user = ctx.user;
    const solutions = ctx.solutions;

    const isAuthor = ctx.isCurrentUser;

    ctx.render(userTemplate(quizzes));

    function userTemplate() {
        return html`
        <section id="profile">
                
                ${isAuthor
                ? html`
                <header class="pad-large">
                    <h1>Profile Page</h1>
                </header>

                <div class="hero pad-large">
                    <article class="glass pad-large profile">
                        <h2>Profile Details</h2>
                        <p>
                            <span class="profile-info">Username:</span>
                            ${user.username}
                        </p>
                        <p>
                            <span class="profile-info">Email:</span>
                            ${user.email}
                        </p>
                        <h2>Your Quiz Results</h2>
                        <table class="quiz-results">
                            <tbody>
                                
                            ${repeat(solutions, s => s.objectId, solutionCard)}

                            </tbody>
                        </table>
                    </article>
                </div>`
                : nothing}

                <header class="pad-large">
                    <h2>Quizes created by ${isAuthor? 'you' : ctx.author.username}</h2>
                </header>

                <div class="pad-large alt-page" @click=${onDelete}>

                    ${repeat(quizzes, q => q.objectId, quizCard)}

                </div>

            </section>`

    }

    async function onDelete(e) {
        let quizId;

        if (e.target.tagName == 'A' && e.target.dataset.action == 'delete') {
            quizId = e.target.dataset.id;
        }

        if (e.target.className.includes('fa-trash-alt')) {
            quizId = e.target.parentElement.dataset.id;
        }

        if(!quizId) {
            return;
        }

        const answer = confirm('Are you sure?')

        if(answer) {

            const quiz = quizzes.find(e => e.objectId == quizId);
            quiz.toDelete = true;

            ctx.render(userTemplate(quizzes));

            await deleteQuiz(quizId);

            ctx.page.redirect(`/user/${ctx.user.objectId}`);
        }

    }

    function solutionCard(solution) {
        return html`
        <tr class="results-row">
            <td class="cell-1">${new Date(solution.createdAt).toDateString()}</td>
            ${solution.quiz
            ? html`<td class="cell-2"><a href="/view/${solution.quiz.objectId}">${solution.quiz.title}</a></td>`
            : html`<td class="cell-2">Deleted quiz</td>`}
            <td class="cell-3 s-correct">${(solution.correct * 100 / solution.total).toFixed()}%</td>
            <td class="cell-4 s-correct">${solution.correct}/${solution.total} correct answers</td>
        </tr>`;
    }

    function quizCard(quiz) {

        const taken = ctx.results.find(e => e.quiz.objectId == quiz.objectId).taken;

        return html`
        <article class="preview layout">
                <div class="right-col">
                    <a class="action cta" href="/view/${quiz.objectId}">View Quiz</a>

                    ${isAuthor
                    ? html `
                    <a class="action cta" href="/edit/${quiz.objectId}"><i class="fas fa-edit"></i></a>
                    <a class="action cta" href="javascript:void(0)" data-id="${quiz.objectId}" data-action="delete"><i class="fas fa-trash-alt"></i></a>`
                    : nothing}
                    
                </div>
                <div class="left-col">
                    <h3><a class="quiz-title-link" href="/view/${quiz.objectId}">${quiz.title}</a></h3>
                    <span class="quiz-topic">Topic: ${quiz.topic}</span>
                    <div class="quiz-meta">
                        <span>${quiz.questionCount} questions</span>
                        <span>|</span>
                        <span>Taken ${taken} times</span>
                    </div>
                </div>
                ${quiz.toDelete ? html`<div class="loading-overlay working"></div>` : nothing}
            </article>`;
    }

}