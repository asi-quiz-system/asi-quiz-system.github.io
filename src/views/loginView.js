import { login } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { createSubmitHandler } from '../util.js';

export function showLogin(ctx) {
    ctx.render(loginTemplate());

    function loginTemplate() {
        return html`
        <section id="login">
            <div class="pad-large">
                <div class="glass narrow">
                    <header class="tab layout">
                        <h1 class="tab-item active">Login</h1>
                        <a class="tab-item" href="/register">Register</a>
                    </header>
                    <form class="pad-med centered" @submit=${createSubmitHandler(onSubmit)}>
                        <label class="block centered">Email: <input class="auth-input input" type="text" name="email" /></label>
                        <label class="block centered">Password: <input class="auth-input input" type="password"
                                name="password" /></label>
                        <input class="block action cta" type="submit" value="Sign In" />
                    </form>
                    <footer class="tab-footer">
                        Don't have an account? <a class="invert" href="/register">Create one here</a>.
                    </footer>
                </div>
            </div>
        </section>`
    }

    async function onSubmit({ email, password }) {

        if (email == '' || password == '') {
            return alert('All fields are required');
        }

        await login(email, password);

        ctx.page.redirect('/');
    }
}