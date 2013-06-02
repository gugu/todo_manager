define([
    'jquery',
    'underscore',
    'backbone',
    'globals',
    'views/todo-manager',
    'views/login'
], function ($, _, Backbone, globals, TodoManagerView, LoginView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'todoManager',
            'login': 'login',
            'logout': 'logout'
        }
    });

    var initialize = function () {
        var router = new AppRouter();
        router.on('route:todoManager', function () {
            var view = new TodoManagerView;
            view.render()
        });
        router.on('route:login', function () {
            var view = new LoginView;
            view.render()
        });
        globals.router = router;
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});