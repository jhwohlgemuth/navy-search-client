/**
 * @file Navy Search Home View
 * @author Jason Wohlgemuth
 * @module views/Home
 * @requires models/Data
**/
define(function(require, exports, module) {
    'use strict';

    var $       = require('jquery');
    var Mn      = require('backbone.marionette');
    var JST     = require('templates');
    var Data    = require('models/Data');

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
                }
            });
        },
        onClickSubmit: function() {
            this.ui.searchInput.toggleClass('fly-out--right').blur();
            this.ui.submitButton.toggleClass('processing');
            this.ui.aboutButton.toggle();
            // var options = {
            //     method: 'GET',
            //     data: {q: this.ui.searchInput.val()},
            //     dataType: 'json',
            //     url: '/api/v1.0/messages/search'
            // };
            // $.ajax(options).done(function(data, status) {
            //     console.log(data);
            // });
        },
        onClickAbout: function() {
            this.ui.main.toggleClass('show-about');
            this.ui.aboutButton.toggleClass('active-btn');
        }
    });

    module.exports = HomeView;
});
