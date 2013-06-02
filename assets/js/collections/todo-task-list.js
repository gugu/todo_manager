define([
    'jquery',
    'underscore',
    'backbone',
    'models/todo-task'
], function ($, _, Backbone, TodoTask) {

    return Backbone.Collection.extend({
        url: '/api/v1/todo/',
        model: TodoTask,
        comparator: function (task) {
            return task.get('priority')
        },
        parse: function(resp, options) {
            return resp.objects;
        }
    })
});