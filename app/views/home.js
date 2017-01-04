/**
 * @file Navy Search Home View
 * @author Jason Wohlgemuth
 * @module views/Home
 * @requires models/Data
**/
define(function(require, exports, module) {
    'use strict';

    var Mn   = require('backbone.marionette');
    var JST  = require('templates');
    var Data = require('models/Data');

    /**
     * @name HomeView
     * @description Home view
     * @constructor
     * @extends Marionette.View
    **/
    var HomeView = Mn.View.extend({
        //view code goes here
        template: JST.home,
        model: new Data.Model(),
        ui: {
            main: '#main',
            aboutButton: '.about-btn'
        },
        events: {
            'click .about-btn': 'onClickAbout',
            'touchstart .about-btn': 'onClickAbout'
        },
        onRender: function() {

        },
        onClickAbout: function() {
            this.ui.main.toggleClass('show-about');
            this.ui.aboutButton.toggleClass('active-btn');
        }
    });

    module.exports = HomeView;
});
