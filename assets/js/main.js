require.config({
    paths: {
        jquery: 'components/jquery/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        'backbone-tastypie': 'components/backbone-tastypie/backbone_tastypie/static/js/backbone-tastypie',
        text: 'components/requirejs-text/text',
        'jquery.sortable': 'lib/jquery.sortable'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'jquery.sortable': {
            deps: ['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone-tastypie': {
            deps: ['backbone']
        }
    }
});

require([
    'jquery',
    'jquery.sortable',
    'backbone',
    'backbone-tastypie',
    'globals',
    'app'], function ($, Sortable, Backbone, Tastypie, globals, App) {
    Backbone.Tastypie.csrfToken = $('input[name=csrfmiddlewaretoken]').val()
    $.ajaxSetup({
        statusCode: {
            401: function () {
                // Redirect the to the login page.
                globals.router.navigate('login', true);

            },
            403: function () {
                // 403 -- Access denied
                globals.router.navigate('denied', true);
            }
        }
    });

    App.initialize();
});