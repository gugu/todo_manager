define(["backbone"], function (Backbone) {
    return Backbone.Model.extend({
        url: '/api/v1/auth/',
        login: function (attributes, options) {
            this.save(attributes, options);
            this.unset('password');
        },
        logout: function () {
            this.id = true;
            this.destroy();
        }
    })
});