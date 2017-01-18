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
        className: 'animated--200 fly-out--left full-width item-wrapper',
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
        onDomRefresh: function() {
            var view = this;
            _.delay(function() {
                view.$el.removeClass('fly-out--left');
            }, (view.model.get('index') * 100) + 200);
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
                this.collection.each(function(model, index) {
                    model.set('index', index);
                });
            }
        }
    });

    module.exports = ResultsCollectionView;
});
