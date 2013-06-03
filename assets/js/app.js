define([
    'jquery',
    'underscore',
    'backbone',
    'globals',
    'router',
    'models/session'
], function ($, _, Backbone, globals, Router, Session) {
    var initialize = function () {
        globals.session = new Session;
        Router.initialize();
    };

    return {
        initialize: initialize
    }
});