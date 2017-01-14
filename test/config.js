var tests = [];
for (var file in window.__karma__.files) {
    // Our test modules are named "<something>Spec.js"
    // If you decide to change the format of the file name this Regex
    // must reflect it.
    if (/\.spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/./app',
    deps: tests,
    paths: {
        //Project Dependencies
        handlebars: '../node_modules/handlebars/dist/handlebars',
        //Backbone Libraries, Frameworks and Dependencies
        jquery:                '../node_modules/jquery/dist/jquery',
        lodash:                '../node_modules/lodash/lodash.min',
        bluebird:              '../node_modules/bluebird/js/browser/bluebird.min',
        'backbone':            '../node_modules/backbone/backbone',
        'backbone.radio':      '../node_modules/backbone.radio/build/backbone.radio',
        'backbone.marionette': '../node_modules/backbone.marionette/lib/backbone.marionette',
        'perfect-scrollbar':   '../node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.min',
        //Helpers and extensions
        'handlebars.helpers': './helpers/handlebars.helpers',
        'jquery.extensions':  './helpers/jquery.extensions',
        //Spies, Stubs, and fake servers (Jasmine is loaded by Karma plugin)
        sinon: '../node_modules/sinon/pkg/sinon'
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    },
    // start test run, once Require.js is done
    callback: window.__karma__.start
});
