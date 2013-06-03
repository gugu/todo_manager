define([
    "backbone",
    "models/session",
    "globals",
    "text!templates/login.jst"
], function (Backbone, Session, globals, login_template) {
    return Backbone.View.extend({
        events: {
            'submit .login-form': 'processAuthentication'
        },
        render: function () {
            this.$el.html(login_template, {});
            return this;
        },
        processAuthentication: function (event) {
            event.preventDefault();
            var session = new Session();
            var form = event.target;
            session.login({
                'username': form.elements.username.value,
                'password': form.elements.password.value
            }, {
                error: _.bind(this.showAuthenticationError, this),
                success: function () {
                    globals.session = session;
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