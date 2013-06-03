"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
from django.contrib.auth import get_user_model

from django.test import TestCase
from todo.models import Todo
from tastypie.models import ApiKey
from tastypie.test import ResourceTestCase

class TaskCRUDTest(TestCase):
    def test_task_crud(self):
        user = get_user_model().objects.create()
        task1 = Todo()
        task1.name = 'Sample task'
        task1.user = user
        task1.save()
        self.assertEqual(task1.priority, 0)
        task2 = Todo()
        task2.name = 'Second task'
        task2.user = user
        task2.save()
        self.assertEqual(task2.priority, 1)
        task1.name = 'New task'
        task1.save()
        task1.delete()
        self.assertEqual(Todo.objects.count(), 1)


class APITest(ResourceTestCase):

    def test_api_calls(self):
        user = get_user_model().objects.create(username='test1')
        api = ApiKey.objects.create(user=user)
        response = self.api_client.get('/api/v1/todo/', authentication=self.create_apikey(user.username, api.key))
        todo_tasks = self.deserialize(response)
        self.assertEqual(todo_tasks['objects'], [])
        response = self.api_client.post('/api/v1/todo/', data={'name' : 'sample task'}, authentication=self.create_apikey(user.username, api.key))
        self.assertHttpCreated(response)
        response = self.api_client.get('/api/v1/todo/', authentication=self.create_apikey(user.username, api.key))
        todo_tasks = self.deserialize(response)
        self.assertEqual(todo_tasks['objects'][0]['name'], 'sample task')

