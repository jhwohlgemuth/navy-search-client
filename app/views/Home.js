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
    var RETURN_KEY_CODE = 13;

    var DetailsView = Mn.View.extend({
        className: 'animated fly-out--top details',
        template: JST.details,
        model: new Data.Model(),
        events: {
            'input input': 'onInput'
        },
        onAttach: function() {
            var details = this;
            var $details = details.$el;
            _.defer(function() {
                $details.toggleClass('fly-out--top');
            });
        },
        onRender: function() {
            var details = this;
            var $details = details.$el;
            $details.keypress(function(e) {
                var key = e.which || e.keyCode;
                if (key === RETURN_KEY_CODE && (e.target.value.length > 0)) {
                    var home = details._parent._parent;
                    var results = home.getRegion('itemsContainer').currentView;
                    home.getSearchResults(e.target.value).then(function(items) {
                        results.collection.reset(items);
                        ps.update(results.el);
                        var $input = details.$('input');
                        $input
                            .focus()
                            .setCursorPosition($input.val().length);
                    });
                }
            });
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
            'click .submit-btn': 'onClickSubmit',
            'keypress @ui.searchInput': 'onKeyPress'
        },
        regions: {
            itemsDetails: {
                el: '.search-results > .details',
                replaceElement: true
            },
            itemsContainer: '.search-results > .items-container'
        },
        behaviors: [
            require('plugins/ie.shim.behavior')
        ],
        onKeyPress: function(e) {
            var view = this;
            var key = e.which || e.keyCode;
            if (key === RETURN_KEY_CODE && (view.ui.searchInput.val().length > 0)) {
                view.triggerMethod('click:submit');
            }
        },
        onClickSubmit: function() {
            var home = this;
            var ui = home.ui;
            if (!ui.submitButton.hasClass('processing')) {
                ui.searchInput
                    .toggleClass('fly-out--right')
                    .attr('disabled', true);
                ui.submitButton.addClass('processing');
                ui.aboutButton.toggle();
                home.details = new DetailsView();
                home.getSearchResults(ui.searchInput.val()).then(function(items) {
                    ui.submitButton
                        .css('display', 'none')
                        .removeClass('processing');
                    ui.searchResults.css('display', 'block');
                    home.showChildView('itemsDetails', home.details);
                    home.showChildView('itemsContainer', new Results({collection: items}));
                    ps.initialize(home.getRegion('itemsContainer').el);
                });
            }
        },
        onClickAbout: function() {
            var ui = this.ui;
            ui.main.toggleClass('show-about');
            ui.aboutButton.toggleClass('active-btn');
        },
        getSearchResults: function(str, ajaxOptions) {
            var view = this;
            var defaults = {
                data: {q: str},
                dataType: 'json',
                url: SEARCH_URL
            };
            return $.get(_.extend(defaults, ajaxOptions))
                .then(function(items) {
                    return _(items)
                        .map(function(item) {return _.omit(item, 'text');})
                        .take(MAX_RESULTS)
                        .value();
                })
                .then(function(items) {
                    view.details.model.set({
                        searchString: str,
                        total: items.length
                    });
                    view.details.render();
                    return items;
                })
                .catch(function(err) {
                    WebApp.error(err);
                });
        }
    });

    module.exports = HomeView;
});
