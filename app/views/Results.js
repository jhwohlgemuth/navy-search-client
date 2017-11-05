/**
 * @file Navy Search Home View
 * @author Jason Wohlgemuth
 * @module views/Home
 * @requires models/Data
**/
define(function(require, exports, module) {
    'use strict';

    var _       = require('lodash');
    var Mn      = require('backbone.marionette');
    var JST     = require('templates');
    var Message = require('models/Message');

    var API_ROOT = 'https://www.navysearch.org/api/v1.0/message/';

    var ChildView = Mn.View.extend({
        className: 'animated--200 fly-out--right full-width item-wrapper',
        model: new Message.Model(),
        template: JST.item,
        events: {
            click: 'onClick'
        },
        onRender: function() {
            var view = this;
            var model = view.model;
            view.$el.attr('data-type', model.get('type'));
        },
        onClick: function() {
            window.open(API_ROOT + this.model.get('id'));
        }
    });
    /**
     * @name ResultsCollectionView
     * @description Collection view to contain message search results
     * @constructor
     * @extends Marionette.View
    **/
    var ResultsCollectionView = Mn.CollectionView.extend({
        className: 'items',
        childView: ChildView,
        initialize: function() {
            var items = this.collection;
            if (!(items instanceof Message.Collection)) {
                this.collection = new Message.Collection(items);
            }
        },
        onDomRefresh: function() {
            const STEP_SIZE = 50;
            this.children.forEach(function(child, index) {
                _.delay(function() {
                    child.$el.removeClass('fly-out--right');
                }, 100 + (index * STEP_SIZE));
            });
        }
    });

    module.exports = ResultsCollectionView;
});
