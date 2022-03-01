from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
import random
import string

# Create your models here.
class Todo(models.Model):
    def unique_todoId_generator(size=8, chars=string.ascii_lowercase+ string.digits):
        return ''.join(random.choice(chars) for __ in range(size))
    sno = models.AutoField(primary_key=True)
    title = models.CharField(max_length=1200)
    description = models.CharField(max_length=2000)
    todoId = models.CharField(max_length=8, default=unique_todoId_generator)
    timestamp = models.DateTimeField(default=now)