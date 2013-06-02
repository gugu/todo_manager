from django.conf import settings
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from tastypie.api import Api
from django.contrib import admin
from todo.api import TodoResource, AuthResource
from todo.views import IndexPageView


admin.autodiscover()

todo_resource = TodoResource()
auth_resource = AuthResource()
v1_api = Api(api_name='v1')
v1_api.register(todo_resource)
v1_api.register(auth_resource)

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^todo_manager/', include('todo_manager.foo.urls')),
                       url(r'^api/', include(v1_api.urls)),

                       # Uncomment the admin/doc line below to enable admin documentation:
                       url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

                       # Uncomment the next line to enable the admin:
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^$', IndexPageView.as_view(), name='home'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
                            url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
                                'document_root': settings.MEDIA_ROOT,
                            }),
    )