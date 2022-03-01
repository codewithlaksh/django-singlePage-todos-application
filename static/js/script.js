// Get the cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Logic to fetch todos
function getTodos(){
    fetch('/api/get-todos', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        var todos = data.todos;
        var tbody = document.getElementById("tbody");
        var output = '';
        for (var index = 0; index < todos.length; index++) {
            const sno = index+1;
            const title = todos[index].title;
            const description = todos[index].description;
            const todoId = todos[index].todoId;
            output += `<tr>
                <td>${sno}</td>
                <td>${title}</td>
                <td>${description}</td>
                <td>
                    <button class="edit btn btn-sm btn-dark" id="${todoId}"><i class="fa fa-pencil"></i> Edit</button>
                    <button class="delete btn btn-sm btn-dark" id="${todoId}"><i class="fa fa-trash"></i> Delete</button>
                </td>
            </tr>`;
        }
        tbody.innerHTML = output;
    })
    .catch(error => {
        console.error(error);
    })
}

// Logic to add a new todo
var addBtn = document.getElementById("addBtn");
var message = document.getElementById("message");
var addForm = document.getElementById("addForm");

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    var formData = new FormData();
    var csrf_token = getCookie('csrftoken');
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('desc').value);
    formData.append('csrfmiddlewaretoken', csrf_token);
    
    fetch('/api/new-todo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success"){
            message.setAttribute("class", "alert alert-success");
            message.innerHTML = "<strong>Success!</strong> " + data.message;
            getTodos();
            addForm.reset();            
        }
        if (data.status == "error"){
            message.setAttribute("class", "alert alert-danger");
            message.innerHTML = "<strong>Error!</strong> " + data.message
            addForm.reset();            
        }
        setTimeout(() => {
            message.setAttribute("class", "");
            message.removeAttribute("class");
            message.innerHTML = "";
        }, 2000);
    })
    .catch(error => {
        console.error(error);
    })
})

// Logic to show edit modal
$('tbody').on('click', '.edit', (e) => {
    var btnId = e.target.id;
    fetch('/api/get-todo/' + btnId, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        var todo = data.todo;

        var todoIdEdit = document.getElementById("todoIdEdit");
        var titleEdit = document.getElementById("titleEdit");
        var descEdit = document.getElementById("descEdit");
        
        todoIdEdit.value = todo.todoId;
        titleEdit.value = todo.title;
        descEdit.value = todo.description;
    })
    $('#editModal').modal('show');
})

// Logic to close the edit modal
var editForm = document.getElementById("editForm");
var todoIdEdit = document.getElementById("todoIdEdit");
$('.modalCloseBtn').click(() => {
    $('#editModal').modal('hide');
    editForm.reset();
    todoIdEdit.value = "";
    todoIdEdit.removeAttribute("value");
})

// Logic to update a todo
var updateBtn = document.getElementById("updateBtn");
var message = document.getElementById("message");
var editForm = document.getElementById("editForm");
var todoIdEdit = document.getElementById("todoIdEdit");

updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    var csrf_token = getCookie('csrftoken');
    
    var formData = new FormData();
    formData.append("csrfmiddlewaretoken", csrf_token);
    formData.append("todoId", document.getElementById("todoIdEdit").value);
    formData.append("title", document.getElementById("titleEdit").value);
    formData.append("description", document.getElementById("descEdit").value);

    fetch('/api/update-todo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success"){
            message.setAttribute("class", "alert alert-success");
            message.innerHTML = "<strong>Success!</strong> " + data.message;
            getTodos();
            editForm.reset();
            todoIdEdit.value = "";
            todoIdEdit.removeAttribute("value");
            $('#editModal').modal('hide');
        }
        if (data.status == "error"){
            message.setAttribute("class", "alert alert-danger");
            message.innerHTML = "<strong>Error!</strong> " + data.message
            editForm.reset();
            todoIdEdit.value = "";
            todoIdEdit.removeAttribute("value");
            $('#editModal').modal('hide');
        }
        setTimeout(() => {
            message.setAttribute("class", "");
            message.removeAttribute("class");
            message.innerHTML = "";
        }, 2000);
    })
    .catch(error => {
        console.error(error);
    })
})

// Logic to delete a todo
$('tbody').on('click', '.delete', (e) => {
    var tr = e.target.parentNode.parentNode;
    var btnId = e.target.id;
    var csrf_token = getCookie('csrftoken');

    var formData = new FormData();
    formData.append("csrfmiddlewaretoken", csrf_token);
    formData.append("todoId", btnId);

    if(window.confirm("Are you sure, you want to delete this todo ?")){
        fetch('/api/delete-todo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == "success"){
                message.setAttribute("class", "alert alert-success");
                message.innerHTML = "<strong>Success!</strong> " + data.message;
                getTodos();
                tr.remove();
            }
            if (data.status == "error"){
                message.setAttribute("class", "alert alert-danger");
                message.innerHTML = "<strong>Error!</strong> " + data.message
            }
            setTimeout(() => {
                message.setAttribute("class", "");
                message.removeAttribute("class");
                message.innerHTML = "";
            }, 2000);
        })
        .catch(error => {
            console.error(error);
        })
    }
    else{
        return false;
    }
})

// Logic to add a live search filter
var searchTxt = document.getElementById("searchTxt");
searchTxt.addEventListener("keyup", (e) => {
    e.preventDefault();
    var searchVal = searchTxt.value;
    var table = document.getElementById("todosTable");
    var tr = table.getElementsByTagName("tr");

    for (var index = 0; index < tr.length; index++) {
        var td = tr[index].getElementsByTagName("td")[1];
        if (td){
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toLowerCase().indexOf(searchVal.toLowerCase()) > -1){
                tr[index].style.display = "";
            }
            else{
                tr[index].style.display = "none";
            }
        }
    }
})