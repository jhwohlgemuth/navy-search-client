/**
 * @file Navy Search Home View
 * @author Jason Wohlgemuth
 * @module views/Home
 * @requires models/Data
**/
define(function(require, exports, module) {
    'use strict';

    var Mn      = require('backbone.marionette');
    var JST     = require('templates');
    var Message = require('models/Message');

    var ChildView = Mn.View.extend({
        className: 'item-wrapper',
        model: new Message.Model(),
        template: JST.item
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
        }
    });

    module.exports = ResultsCollectionView;
});
