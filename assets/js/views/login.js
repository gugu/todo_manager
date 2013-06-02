define([
    "backbone",
    "models/user",
    "globals",
    "text!templates/login.jst"
], function (Backbone, User, globals, login_template) {
    return Backbone.View.extend({
        el: $('#container'),
        events: {
            'submit .login-form': 'processAuthentication'
        },
        render: function () {
            this.$el.html(login_template, {})
        },
        processAuthentication: function (event) {
            event.preventDefault();
            var user = new User();
            var form = event.target;
            user.set('username', form.elements.username.value);
            user.set('password', form.elements.password.value);
            user.save(null, {
                error: _.bind(this.showAuthenticationError, this),
                success: function () {
                    globals.router.navigate('', true);
                }
            });
        },
        showAuthenticationError: function (model, xhr, options) {
            var error_message = JSON.parse(xhr).auth;

            this.$('.error-message').text('');
            if (error_message['__all__']) {
                this.$('.form-error').text(error_message['__all__'])
            }
            delete error_message['__all__'];

            _.each(_.keys(error_message), _.bind(function (field) {
                var message = error_message[field];
                this.$('.' + field + '-error').text(message)
            }, this));
        }
    });
});