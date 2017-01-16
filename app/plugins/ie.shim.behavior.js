define(function(require, exports, module) {
    'use strict';

    var Mn = require('backbone.marionette');

    function isEmptyInput(el) {
        return el.value.length === 0;
    }

    var InternetExplorerShimBehavior = Mn.Behavior.extend({
        events: {
            'input input': 'shimInput'
        },
        shimInput: function(e) {
            this.ui.searchInput.toggleClass('ie-shim-input', !isEmptyInput(e.currentTarget));
        }
    });

    module.exports = InternetExplorerShimBehavior;
});
