/**
 * @file Data model and collection module
 * @author Jason Wohlgemuth
 * @module models/Data
 * @requires app
**/
define(function(require, exports) {
    'use strict';

    var Backbone = require('backbone');
    var WebApp   = require('app');

    /**
     * @name DataModel
     * @description Data model
     * @constructor
     * @extends Backbone.Model
    **/
    var DataModel = Backbone.Model.extend({
        defaults: {
            name: WebApp.model.get('name')
        }
    });
    /**
     * @name DataCollection
     * @description Data collection
     * @constructor
     * @extends Backbone.Collection
     * @prop {DataModel} model
    **/
    var DataCollection = Backbone.Collection.extend({
        model: DataModel
    });

    exports.Model      = DataModel;
    exports.Collection = DataCollection;
});
