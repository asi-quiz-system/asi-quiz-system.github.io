import { repeat } from '../lib/directives/repeat.js';
import { html, nothing } from '../lib/lit-html.js';

export function showResult(ctx) {
   
    const quiz = ctx.data.quiz;
    const answers = ctx.data.answers;
    const correct = ctx.data.correct;
    const total = ctx.data.total;
    const questions = ctx.questions;

    ctx.render(resultTemplate());

    function resultTemplate(answers) {
        return html`
        <section id="summary">
            <div class="hero layout">
                <article class="details glass">
                    <h1>Quiz Results</h1>
                    <h2>${quiz.title}</h2>
        
                    <div class="summary summary-top">
                        ${(correct * 100 / total).toFixed()}%
                    </div>
        
                    <div class="summary">
                        ${correct}/${total} correct answers
                    </div>
        
                    <a class="action cta" href="/quiz/${quiz.objectId}"><i class="fas fa-sync-alt"></i> Retake Quiz</a>
                    <a class="action cta" href="javascript:void(0)" @click=${seeDetails}><i class="fas fa-clipboard-list"></i> See Details</a>
        
                </article>
            </div>
        
            <div class="pad-large alt-page" @click=${onReveal}>
        
                ${answers
                ? repeat(answers, a => a.questionId, createQuestionCard)
                : nothing}
        
            </div>
        
        </section>`

    }

    function seeDetails() {
        ctx.render(resultTemplate(answers));
    }

    function onReveal(e) {
        if (e.target.tagName != 'BUTTON') {
            return;
        }

        const questionId = e.target.dataset.id;

        const answer = answers.find(e => e.questionId == questionId);

        if (e.target.textContent.includes('Close')) {
            answer.reveal = false;
        } else {
            answer.reveal = true;
        }

        ctx.render(resultTemplate(answers));
    }

    function createQuestionCard(answer) {
        const isCorrect = answer.solution == answer.correct;
        const question = questions.find(e => e.objectId == answer.questionId);
        const correctIndex = answer.correct;
        const solutionIndex = answer.solution;

        let qTitle;
        let qDesc = html`
            <div>
                <p>${question.text}</p>
            
                ${question.answers.map((e, i) => answerCard(e, i))}
            
            </div>`;

        if (isCorrect) {
            qTitle = html`
                        <span class="s-correct">
                            Question ${answers.indexOf(answer) + 1}
                            <i class="fas fa-check"></i>
                        </span>
                        <div class="right-col">
                            <button class="action" data-id="${answer.questionId}">${answer.reveal ? 'Close' : 'See question'}</button>
                        </div>`;
        } else {
            qTitle = html`
                    <span class="s-incorrect">
                        Question ${answers.indexOf(answer) + 1}
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="right-col">
                        <button class="action" data-id="${answer.questionId}">${answer.reveal ? 'Close' : 'Reveal answer'}</button>
                    </div>`;
        }

        return html`
        <article class="preview">
        
            ${qTitle}
        
            ${answer.reveal ? qDesc : nothing}
        
        </article>`

        function answerCard(answer, index) {
            return html`
            <div class="s-answer">
                <span class=${index !=solutionIndex && index !=correctIndex     ? nothing     : index==solutionIndex     ? 's-correct'
                        : 's-incorrect' }>
            
                    ${answer}
            
                    ${!isCorrect && index == solutionIndex
                    ? html`<i class="fas fa-times"></i>
                    <strong>Your choice</strong>`
                    : nothing}
            
                    ${!isCorrect && index == correctIndex
                    ? html`<i class="fas fa-check"></i>
                    <strong>Correct answer</strong>`
                    : nothing}
            
                    ${isCorrect && index == correctIndex
                    ? html`<i class="fas fa-check"></i>
                    <strong>Correct answer</strong>`
                    : nothing}
            
                </span>
            </div>
            `
        }

    }

}