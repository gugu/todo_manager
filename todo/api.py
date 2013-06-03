from django.contrib.auth import get_user_model, login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.db import IntegrityError

from tastypie import fields
from tastypie.exceptions import ImmediateHttpResponse, BadRequest
from tastypie.validation import FormValidation
from tastypie.resources import ModelResource, Resource
from tastypie.authentication import MultiAuthentication, SessionAuthentication, ApiKeyAuthentication, Authentication
from tastypie.authorization import Authorization
from todo.models import Todo


class AuthResource(Resource):
    username = fields.CharField()
    password = fields.CharField()

    def obj_create(self, bundle, **kwargs):
        self.is_valid(bundle)
        if bundle.errors:
            raise ImmediateHttpResponse(response=self.error_response(bundle.request, bundle.errors))

        user = authenticate(username=bundle.data['username'], password=bundle.data['password'])
        login(bundle.request, user)
        return bundle

    def obj_delete_list(self, bundle, **kwargs):
        logout(bundle.request)

    def get_resource_uri(self, bundle_or_obj=None, url_name='api_dispatch_list'):
        return '/'

    class Meta:
        always_return_data = True
        object_class = get_user_model()
        validation = FormValidation(form_class=AuthenticationForm)


class UserResource(ModelResource):
    def obj_create(self, bundle, **kwargs):
        try:
            bundle = super(UserResource, self).obj_create(bundle, **kwargs)
            bundle.obj.set_password(bundle.data.get('password1'))
            bundle.obj.save()
        except IntegrityError:
            raise BadRequest('That username already exists')
        return bundle

    class Meta:
        allowed_methods = ['post']
        queryset = get_user_model().objects.all()
        object_class = get_user_model()
        always_return_data = True
        authentication = Authentication()
        authorization = Authorization()
        validation = FormValidation(form_class=UserCreationForm)
        fields = ['username']


class TodoResource(ModelResource):
    def apply_filters(self, request, applicable_filters):
        queryset = super(TodoResource, self).apply_filters(request, applicable_filters)
        return queryset.filter(user=request.user)

    def obj_create(self, bundle, **kwargs):
        kwargs['user'] = bundle.request.user
        return super().obj_create(bundle, **kwargs)

    class Meta:
        always_return_data = True
        queryset = Todo.objects.all()
        authentication = MultiAuthentication(SessionAuthentication(), ApiKeyAuthentication())
        authorization = Authorization()
        resource_name = 'todo'