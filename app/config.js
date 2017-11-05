/* global requirejs */
/**
 * @file RequireJS configuration file
 * @author Jason Wohlgemuth
**/
requirejs.config({
    baseUrl: '',
    //urlArgs is used to cache bust.
    //development should use timestamp, production should use version
    urlArgs: `bust=${ (new Date()).getTime()}`,
    deps: ['main'],
    paths: {
        //Project Dependencies
        handlebars: '../node_modules/handlebars/dist/handlebars',
        //Backbone Libraries, Frameworks and Dependencies
        jquery:                '../node_modules/jquery/dist/jquery',
        lodash:                '../node_modules/lodash/lodash.min',
        bluebird:              '../node_modules/bluebird/js/browser/bluebird.min',
        backbone:            '../node_modules/backbone/backbone',
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
    }
});
