'use strict';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap';

document.body.innerHTML = `
    <div class="container">
    <h1>B4 - Book Bundler</h1>
    <div class="b4-alerts"></div>
    <div class="b4-main"></div>
    </div>
    `;

const mainElement = document.body.querySelector('.b4-main');

mainElement.innerHTML = `
    <div class="jumbotron">
        <h1> Welcome!</h1>
        <p>B4 is an application for creating book bundles.</p>
        </div>
        `;
const alertsElement = document.body.querySelector('.b4-alerts');

alertsElement.innerHTML = `
    <div class="alert alert-success alert-dismissible fade in" role="alert">
    <button class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    <strong>Success!</strong> Bootstrap is working.
    </div>
    `;