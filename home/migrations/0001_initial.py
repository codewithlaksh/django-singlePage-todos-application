# Generated by Django 4.0.2 on 2022-02-28 00:53

from django.db import migrations, models
import django.utils.timezone
import home.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('sno', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=1200)),
                ('description', models.CharField(max_length=2000)),
                ('todoId', models.CharField(default=home.models.Todo.unique_todoId_generator, max_length=8)),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
