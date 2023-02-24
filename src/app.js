import page from './lib/page.mjs';

import { addRender } from './middlewares/render.js';
import { addSession } from './middlewares/session.js';
import { addUserNav } from './middlewares/userNav.js';
import { preloadQuiz, preloadCount, preloadLastQuiz, preloadAnswers, preloadProfile } from './middlewares/preloader.js';
import { hasUser, isCurrentUser, isOwner } from './middlewares/guards.js';
import { addQuery } from './middlewares/query.js';

import { showLogin } from './views/loginView.js';
import { showRegister } from './views/registerView.js';
import { navTemplate } from './views/nav.js';
import { showBrowse } from './views/browseView.js';
import { showHome } from './views/homeView.js';
import { showCreate } from './views/createView.js';
import { showEdit } from './views/editView.js';
import { showDetails } from './views/detailsView.js';
import { showQuiz } from './views/quizView.js';
import { showResult } from './views/resultView.js';
import { showUser } from './views/userView.js';

import { getUserData } from './util.js';

const main = document.getElementById('content');
const nav = document.getElementById('titlebar');

page(addRender(main, nav));
page(addSession(getUserData));
page(addUserNav(navTemplate));
page(addQuery());

page('/', preloadCount(), preloadLastQuiz(), showHome);
page('/login', showLogin);
page('/register', showRegister);
page('/browse', showBrowse)
page('/create', hasUser(), showCreate);
page('/edit/:id', preloadQuiz('id'), isOwner(), showEdit);
page('/view/:id', preloadQuiz('id'), showDetails);
page('/quiz/:id', hasUser(), preloadQuiz('id'), showQuiz);
page('/result/:id', hasUser(), preloadAnswers('id'), isOwner(), showResult);
page('/user/:id', isCurrentUser(), preloadProfile('id'), showUser);
page('*', '/');

page.start();