/**
 * @file Message model and collection module
 * @author Jason Wohlgemuth
 * @module models/Message
**/
define(function(require, exports) {
    'use strict';

    var Backbone = require('backbone');

    /**
     * @name MessageModel
     * @description Message model
     * @constructor
     * @extends Backbone.Model
     * @prop {object} defaults
     * @prop {string} defaults.id
     * @prop {string} defaults.type
     * @prop {string} defaults.code
     * @prop {string} defaults.year
     * @prop {string} defaults.num
     * @prop {string} defaults.url
     * @prop {string} defaults.text
     * @prop {number} defaults.score
    **/
    var MessageModel = Backbone.Model.extend({
        defaults: {
            id: '',
            type: '',
            code: '',
            year: '',
            num: '',
            url: '',
            text: '',
            score: 0
        },
        getCurrentYear: function(formatString) {
            var today = new Date();
            formatString = formatString || 'YY';
            return Number(String(today.getFullYear()).substring(formatString.length));
        }
    });
    /**
     * @name MessageCollection
     * @description Message collection
     * @constructor
     * @extends Backbone.Collection
     * @prop {MessageModel} model
    **/
    var MessageCollection = Backbone.Collection.extend({
        model: MessageModel
    });

    exports.Model = MessageModel;
    exports.Collection = MessageCollection;
});
