define(["backbone"], function (Backbone) {
    return Backbone.Model.extend({
        url: '/api/v1/auth/'
    })
});