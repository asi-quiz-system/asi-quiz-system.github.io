import { html, nothing } from '../lib/lit-html.js';


export function showDetails(ctx) {

    const userId = ctx.user?.objectId;
   
    const quiz = ctx.data;

    const creatorId = ctx.data.owner.objectId;

    ctx.render(quizTemplate());

    function quizTemplate() {
        return html`
    <section id="details">
        <div class="pad-large alt-page">
            <article class="details">
                <h1>${quiz.title}</h1>
                <span class="quiz-topic">A quiz by <a href="/user/${creatorId}">${quiz.author}</a> on the topic of ${quiz.topic}</span>
                <div class="quiz-meta">
                    <span>${quiz.questionCount} Questions</span>
                    <span>|</span>
                    <span>Taken ${ctx.taken.taken} times</span>
                </div>
                <p class="quiz-desc">${quiz.description}</p>
    
                ${userId && quiz.questionCount > 0
                ? html`
                <div>
                    <a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>
                </div>`
                : nothing}
    
    
            </article>
        </div>
    </section>`;
    }

}