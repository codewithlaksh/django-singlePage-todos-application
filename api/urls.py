from django.urls import path
from . import views

urlpatterns = [
    path('get-todos', views.getTodos, name='getTodos'),
    path('new-todo', views.newTodo, name='newTodo'),
    path('get-todo/<str:todo_todoId>', views.getTodo, name='getTodo'),
    path('update-todo', views.updateTodo, name='updateTodo'),
    path('delete-todo', views.deleteTodo, name='deleteTodo')
]
