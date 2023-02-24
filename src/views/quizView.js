import * as quizService from '../data/quiz.js';
import * as solutionService from '../data/solution.js';
import * as answersService from '../data/answers.js';
import { html, nothing } from '../lib/lit-html.js';
import { classMap } from '../lib/directives/class-map.js';

export function showQuiz(ctx) {

    const userId = ctx.user?.objectId;
    const quizId = ctx.params.id;
    const quiz = ctx.data;
    const questions = ctx.questions.results.map(el => Object.assign(el, {status : ''}));
    const qCount = questions.length;
    let currentQuestion = 1;
    let remaining = qCount;

    questions.forEach((q, i) => {
        q.solution = null;
        q.status = {'q-current' : false, 'q-answered' : false};
        if (i == currentQuestion - 1) {
            q.status['q-current'] = true;
        }
    });

    ctx.render(quizTemplate(questions[currentQuestion - 1]));

    function quizTemplate(question) {
        return html`
    <section id="quiz">
        <header class="pad-large">
            <h1>${quiz.title}: Question ${currentQuestion} / ${qCount}</h1>
            <nav class="layout q-control"  @click=${onNavClick}>
                <span class="block">Question index</span>

                ${questions.map(questionIndex)}
               
            </nav>
        </header>
        <div class="pad-large alt-page">
    
            <article class="question">
                <p class="q-text">
                    ${question.text}
                </p>
    
                <div>
    
                    ${question.answers.map(answerCard)}
    
                </div>
    
                <nav class="q-control" @click=${onQuestionClick}>
                    <span class="block">${remaining} questions remaining</span>

                    ${currentQuestion > 1
                        ? html`<a class="action" href="javascript:void(0)"><i class="fas fa-arrow-left"></i> Previous</a>`
                        : nothing}
    
                    <a class="action" href="javascript:void(0)"><i class="fas fa-sync-alt"></i> Start over</a>
                    <div class="right-col">

                    ${currentQuestion < qCount
                        ? html `<a class="action" href="javascript:void(0)">Next <i class="fas fa-arrow-right"></i></a>`
                        :nothing}
                        
                        <a class="action" href="javascript:void(0)">Submit answers</a>
                    </div>
                </nav>
            </article>
    
        </div>
    </section>`;

        function questionIndex(question) {
            return html`
            <a class="q-index ${classMap(question.status)}" href="javascript:void(0)"></a>`;
        }

        function answerCard(answer) {
            return html`
            <label class="q-answer radio">
                <input class="input" type="radio" name="question-${currentQuestion}" value="${question.answers.indexOf(answer)}" />
                <i class="fas fa-check-circle"></i>
                ${answer}
            </label>`;
        }

    }

    function onNavClick(e) {
        
        if (e.target.tagName != 'A') {
            return;
        }

        checkAnswer();

        const index = [...e.target.parentElement.children].indexOf(e.target);

        currentQuestion = index;

        changeStatus();
    }

    async function onSubmit() {

        checkAnswer();

        ctx.taken.taken++;

        quizService.updateStat(ctx.taken.objectId, quizId, ctx.taken.taken);
      
        const {results : correctAnswers} = await solutionService.getByQuizId(quizId);

        const answers = questions.map(q => Object.assign({}, {
            solution : q.solution, 
            questionId : q.objectId,
            correct : correctAnswers.find(e => e.question.objectId == q.objectId).correct}));
        const total = answers.length;
        const correct = answers.filter(e => e.solution == e.correct).length;

        const result = await answersService.create({answers, total, correct}, userId, quizId);

        ctx.page.redirect(`/result/${result.objectId}`);

    }

    function onQuestionClick(e) {
        if (e.target.textContent.includes('Submit answers')) {
            onSubmit();
        }
        if (e.target.textContent.includes('Previous')) {
            checkAnswer();
            currentQuestion--;
        }
        if (e.target.textContent.includes('Next')) {
            checkAnswer();
            currentQuestion++;
        }
        if (e.target.textContent.includes('Start over')) {
            questions.forEach(q => {
                q.status['q-answered'] = false;
                q.solution = null;
                remaining = qCount;
            });
            currentQuestion = 1;
        }

        changeStatus();

    }

    function applyAnswer() {
        const solutionIndex = questions[currentQuestion - 1].solution;
        const answers = [...document.getElementsByName(`question-${currentQuestion}`)];
        answers.forEach(a => a.checked = false);
        if (solutionIndex !== null && solutionIndex !== undefined) {
            answers[solutionIndex].checked = true;
        }
    }

    function checkAnswer() {
        const result = [...document.getElementsByName(`question-${currentQuestion}`)];
        if ( result.some(e => e.checked)) {
            questions[currentQuestion - 1].status['q-answered'] = true;
            questions[currentQuestion - 1].solution = result.findIndex(e => e.checked);
        }
        const answered = questions.filter( q => typeof q.solution == 'number').length;
        remaining = qCount - answered;
    }

    function changeStatus() {

        questions.forEach((q, i) => {
            q.status['q-current'] = false;
               
            if(i == currentQuestion - 1) {
                q.status['q-current'] = true;
            } 
        });

        ctx.render(quizTemplate(questions[currentQuestion - 1]));
        applyAnswer();
    }

}