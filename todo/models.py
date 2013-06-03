from django.conf import settings
from django.db import models
from django.db.models import Max


class Todo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=4096)
    priority = models.PositiveIntegerField()

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        max_priority = self.__class__.objects.filter(user=self.user).aggregate(Max('priority'))['priority__max']
        if self.priority is None:
            self.priority = max_priority + 1 if max_priority is not None else 0
        super().save(force_insert, force_update, using, update_fields)

    class Meta:
        ordering = ['priority']