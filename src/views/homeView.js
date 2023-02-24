
import { html, nothing } from '../lib/lit-html.js';


export async function showHome(ctx) {

    const quiz = ctx.quiz;
    
    ctx.render(homeTemplate());


    function homeTemplate() {
        return html`
        <section id="welcome">
        
            <div class="hero layout">
                <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
                <div class="glass welcome">
                    <h1>Welcome to Quiz Fever!</h1>
                    <p>Home to ${ctx.quizCount} quizzes in 4 topics. <a href="/browse">Browse all quizes</a>.</p>
                    ${ctx.user
                    ? nothing
                    : html`<a class="action cta" href="/login">Sign in to create a quiz</a>`}
                    
                </div>
            </div>
        
            <div class="pad-large alt-page">
                <h2>Our most recent quiz:</h2>
        
                <article class="preview layout">
                    <div class="right-col">
                        <a class="action cta" href="/view/${quiz.objectId}">View Quiz</a>
                    </div>
                    <div class="left-col">
                        <h3>${quiz.title}</h3>
                        <span class="quiz-topic">Topic: ${quiz.topic}</span>
                        <div class="quiz-meta">
                            <span>${quiz.questionCount} questions</span>
                            <span>|</span>
                            <span>Taken ${ctx.taken} times</span>
                        </div>
                    </div>
                </article>
        
                <div>
                    <a class="action cta" href="/browse">Browse all quizzes</a>
                </div>
            </div>
        
        </section>`
    }

}