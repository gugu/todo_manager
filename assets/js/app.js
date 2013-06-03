define([
    'jquery',
    'underscore',
    'backbone',
    'globals',
    'router',
    'models/user'
], function ($, _, Backbone, globals, Router, User) {
    var initialize = function () {
        globals.user = new User;
        Router.initialize();
    };

    return {
        initialize: initialize
    }
});