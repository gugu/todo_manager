define([
    'jquery',
    'underscore',
    'backbone',
    'globals',
    'views/todo-manager',
    'views/login',
    'views/registration'
], function ($, _, Backbone, globals, TodoManagerView, LoginView, RegistrationView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'todoManager',
            'login': 'login',
            'logout': 'logout',
            'register': 'register'
        },
        switchView: function(view) {
            if (this.currentView) {
                this.currentView.remove()
            }
            this.currentView = new view();
            $(this.currentView.render().el).appendTo('#container');

        }
    });

    var initialize = function () {
        var router = new AppRouter();
        router.on('route:todoManager', function () {
            router.switchView(TodoManagerView);
        });
        router.on('route:register', function () {
            router.switchView(RegistrationView);
        });
        router.on('route:login', function () {
            router.switchView(LoginView);
        });
        router.on('route:logout', function () {
            globals.session.logout();
            router.navigate('login', true)
        });
        globals.router = router;
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});