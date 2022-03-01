from django.shortcuts import render
from home.serializers import TodoSerializer
from home.models import Todo
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse

# Create your views here.
@api_view(['GET'])
def getTodos(request):
    todos = Todo.objects.all()
    serializer = TodoSerializer(todos, many=True)
    return Response({'todos': serializer.data})

@api_view(['GET'])
def getTodo(request, todo_todoId):
    todo = Todo.objects.filter(todoId=todo_todoId).first()
    if not todo:
        return Response({"error": "This todo doesn't exits!"})
    serializer = TodoSerializer(todo, many=False)
    return Response({'todo': serializer.data})

def newTodo(request):
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST["description"]

        if len(title) == 0 or len(description) == 0:
            return JsonResponse({'status': 'error', 'message': 'Please fill up all the fields of the form!'})
        elif len(title) < 5 or len(description) < 10:
            return JsonResponse({'status': 'error', 'message': 'Please fill up the form correctly!'})
        else:
            new_todo = Todo(title=title, description=description)
            new_todo.save()
            return JsonResponse({'status': 'success', 'message': 'Your todo has been added successfully!'})
    else:
        return HttpResponse("Bad Request: 400")

def updateTodo(request):
    if request.method == "POST":
        todoId = request.POST["todoId"]
        title = request.POST["title"]
        description = request.POST["description"]

        update_todo = Todo.objects.filter(todoId=todoId).first()

        if len(title) == 0 or len(description) == 0:
            return JsonResponse({'status': 'error', 'message': 'Please fill up all the fields of the form!'})
        elif len(title) < 5 or len(description) < 10:
            return JsonResponse({'status': 'error', 'message': 'Please fill up the form correctly!'})
        else:
            update_todo.title = title
            update_todo.description = description
            update_todo.save()
            return JsonResponse({'status': 'success', 'message': 'Your todo has been updated successfully!'})
    else:
        return HttpResponse("Bad Request: 400")

def deleteTodo(request):
    if request.method == "POST":
        todoId = request.POST["todoId"]

        delete_todo = Todo.objects.filter(todoId=todoId).first()
        delete_todo.delete()
        return JsonResponse({'status': 'success', 'message': 'Your todo has been deleted successfully!'})
    else:
        return HttpResponse("Bad Request: 400")