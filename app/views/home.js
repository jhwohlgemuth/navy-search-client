/**
 * @file Navy Search Home View
 * @author Jason Wohlgemuth
 * @module views/Home
 * @requires models/Data
**/
define(function(require, exports, module) {
    'use strict';

    var $      = require('jquery');
    var _      = require('underscore');
    var Mn     = require('backbone.marionette');
    var JST    = require('templates');
    var WebApp = require('app').model;
    var Data   = require('models/Data');

    var SEARCH_URL = '/api/' + WebApp.get('version') + '/messages/search';

    /**
     * @name HomeView
     * @description Home view
     * @constructor
     * @extends Marionette.View
    **/
    var HomeView = Mn.View.extend({
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
                if (key === RETURN_KEY_CODE && (view.ui.searchInput.val().length > 0)) {
                    view.triggerMethod('click:submit');
                    $(document).off('keypress');
                }
            });
        },
        onClickSubmit: function() {
            var view = this;
            var ui = view.ui;
            if (!ui.submitButton.hasClass('processing')) {
                ui.searchInput.toggleClass('fly-out--right').blur();
                ui.submitButton.toggleClass('processing');
                ui.aboutButton.toggle();
                var searchString = ui.searchInput.val();
                view.getSearchResults(searchString).then(function(results) {
                    // console.log(results);
                });
            }
        },
        onClickAbout: function() {
            var ui = this.ui;
            ui.main.toggleClass('show-about');
            ui.aboutButton.toggleClass('active-btn');
        },
        getSearchResults: function(str, ajaxOptions) {
            var defaults = {
                data: {q: str},
                dataType: 'json',
                url: SEARCH_URL
            };
            return $.get(_.extend(defaults, ajaxOptions));
        }
    });

    module.exports = HomeView;
});
