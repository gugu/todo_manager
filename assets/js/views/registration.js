define([
    "backbone",
    "models/user",
    "globals",
    "text!templates/registration.jst"
], function (Backbone, User, globals, registration_template) {
    return Backbone.View.extend({
        events: {
            'submit form.registration': 'processRegistration'
        },
        render: function () {
            this.$el.html(registration_template, {});
            return this;
        },

        showRegistrationError: function (model, xhr, options) {
            var error_message = JSON.parse(xhr).user;

            this.$('.error-message').text('');
            if (error_message['__all__']) {
                this.$('.form-error').text(error_message['__all__'])
            }
            delete error_message['__all__'];

            _.each(_.keys(error_message), _.bind(function (field) {
                var message = error_message[field];
                this.$('.' + field + '-error').text(message)
            }, this));
        },
        processRegistration: function (event) {
            event.preventDefault();
            var user = new User();
            var form = event.target;
            user.set('username', form.elements.username.value);
            user.set('password1', form.elements.password1.value);
            user.set('password2', form.elements.password2.value);
            user.save(null, {
                error: _.bind(this.showRegistrationError, this),
                success: function () {
                    globals.router.navigate('login', true);
                }
            });
        }
    })
});