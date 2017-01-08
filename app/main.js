/**
 * @file Main entry point for application
 * @author Jason Wohlgemuth
 * @requires app
 * @requires router
 * @requires views/example
**/
define(function(require) {
    'use strict';

    var Backbone = require('backbone');
    var WebApp   = require('app');
    var Example  = require('router');
    var Homepage = require('views/home');

    WebApp.on('before:start', function() {
        WebApp.info('Starting...');
        WebApp.router = new Example.Router();
    });
    WebApp.on('start', function() {
        Backbone.history.start();
        WebApp.info('Started!');
        WebApp.showView(new Homepage(), {replaceElement: true});
    });
    if (typeof (define) === 'undefined') {
        //Not AMD ==> Bundled with Browserify
        document.addEventListener('DOMContentLoaded', function() {
            WebApp.start();
        });
    } else {
        //AMD == > Bundled with r.js
        WebApp.start();
    }
});
