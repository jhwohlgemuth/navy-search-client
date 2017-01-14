/**
 * @file View for static content
 * @module views/Static
 * @requires models/Data
 * @see http://marionettejs.com/docs/master/marionette.view.html#managing-an-existing-page
**/
define(function(require, exports, module) {
    'use strict';

    var Mn   = require('backbone.marionette');
    var JST  = require('templates');
    var Data = require('models/Data');

    /**
     * @name StaticView
     * @constructor
     * @extends Marionette.View
    **/
    var StaticView = Mn.View.extend({
        template: JST.empty,
        model: (new Data.Model()),
        initialize: function() {
            this.render();
        }
    });

    module.exports = StaticView;
});
