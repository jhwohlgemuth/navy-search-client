/**
 * @file Navy Search Home View
 * @author Jason Wohlgemuth
 * @module views/Home
 * @requires models/Data
**/
define(function(require, exports, module) {
    'use strict';

    var $       = require('jquery');
    var _       = require('lodash');
    var ps      = require('perfect-scrollbar');
    var Mn      = require('backbone.marionette');
    var JST     = require('templates');
    var WebApp  = require('app').model;
    var Data    = require('models/Data');
    var Results = require('views/Results');

    var SEARCH_URL = '/api/' + WebApp.get('version') + '/messages/search';
    var MAX_RESULTS = 400;

    var DetailsView = Mn.View.extend({
        className: 'details',
        template: JST.details,
        model: new Data.Model(),
        events: {
            'input input': 'onInput'
        },
        onInput: function() {}
    });

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
            main:          '#main',
            searchInput:   '.navy-search > input',
            submitButton:  '.submit-btn',
            searchResults: '.search-results',
            aboutButton:   '.about-btn'
        },
        events: {
            'click .about-btn': 'onClickAbout',
            'touchstart .about-btn': 'onClickAbout',
            'click .submit-btn': 'onClickSubmit'
        },
        regions: {
            itemsDetails: {
                el: '.search-results > .details',
                replaceElement: true
            },
            itemsContainer: '.search-results > .items-container'
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
                ui.submitButton.addClass('processing');
                ui.aboutButton.toggle();
                var searchString = ui.searchInput.val();
                var details = new DetailsView();
                view.getSearchResults(searchString)
                    .then(function(items) {
                        ui.submitButton
                            .css('display', 'none')
                            .removeClass('processing');
                        details.model.set({
                            searchString: searchString,
                            total: items.length
                        });
                        var collection = _(items)
                            .map(function(item) {return _.omit(item, 'text');})
                            .take(MAX_RESULTS).value();
                        return new Results({collection: collection});
                    })
                    .then(function(results) {
                        ui.searchResults.css('display', 'block');
                        view.showChildView('itemsDetails', details);
                        view.showChildView('itemsContainer', results);
                        ps.initialize(view.getRegion('itemsContainer').el);
                    })
                    .catch(function(err) {
                        WebApp.error(err);
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
