define(["backbone"], function (Backbone) {
    return Backbone.Model.extend({
        url: '/api/v1/auth/',
        logout: function () {
            this.id = true;
            this.destroy();
        }
    })
});