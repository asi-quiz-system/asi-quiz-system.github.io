import { register } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { createSubmitHandler } from '../util.js';

export function showRegister(ctx) {
    ctx.render(registerTemplate());

    function registerTemplate() {
        return html`
        <section id="register">
                <div class="pad-large">
                    <div class="glass narrow">
                        <header class="tab layout">
                            <a class="tab-item" href="/login">Login</a>
                            <h1 class="tab-item active">Register</h1>
                        </header>
                        <form class="pad-med centered" @submit=${createSubmitHandler(onSubmit)}>
                            <label class="block centered">Username: <input class="auth-input input" type="text"
                                    name="username" /></label>
                            <label class="block centered">Email: <input class="auth-input input" type="text"
                                    name="email" /></label>
                            <label class="block centered">Password: <input class="auth-input input" type="password"
                                    name="password" /></label>
                            <label class="block centered">Repeat: <input class="auth-input input" type="password"
                                    name="repass" /></label>
                            <input class="block action cta" type="submit" value="Create Account" />
                        </form>
                        <footer class="tab-footer">
                            Already have an account? <a class="invert" href="/login">Sign in here</a>.
                        </footer>
                    </div>
                </div>
            </section>`
    }
    
    async function onSubmit({ email, password, username, repass }) {
    
        if (email == '' || password == '' || repass == '' || username == '') {
            return alert('All fields are required');
        }

        if (password != repass) {
            return alert('Passwords don\'t match');
        }
    
        await register(email,username, password);

        ctx.page.redirect('/');
    }
}