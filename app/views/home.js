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
            searchInput: '.navy-search > input',
            submitButton: '.submit-btn',
            aboutButton: '.about-btn'
        },
        events: {
            'click .about-btn': 'onClickAbout',
            'touchstart .about-btn': 'onClickAbout',
            'click .submit-btn': 'onClickSubmit'
        },
        initialize: function() {
            var view = this;
            var RETURN_KEY_CODE = 13;
            $(document).keypress(function(e) {
                var key = e.which || e.keyCode;
                if (key === RETURN_KEY_CODE && (view.ui.searchInput.val().length > 1)) {
                    view.triggerMethod('click:submit');
                }
            });
        },
        onRender: function() {

        },
        onClickAbout: function() {
            this.ui.main.toggleClass('show-about');
            this.ui.aboutButton.toggleClass('active-btn');
        },
        onClickSubmit: function() {
            this.ui.searchInput.toggleClass('fly-out--right');
            this.ui.submitButton.toggleClass('processing');
            this.ui.aboutButton.toggle();
        }
    });

    module.exports = HomeView;
});
