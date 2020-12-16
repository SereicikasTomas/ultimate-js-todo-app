var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var form = document.querySelector('.form');
var input = document.querySelector('.form__input');
var todoList = document.querySelector('.todo-list');
var filter = document.querySelector('.filter');
var sort = document.querySelector('.sort');
var createId = function () {
    var date = new Date();
    return date.getTime();
};
var allTodos = getSavedTodos();
var todosForFilter = allTodos;
allTodos.forEach(function (todo, index) { return renderTodo(todo, index); });
form.addEventListener('submit', addTodo);
todoList.addEventListener('click', todoClick);
filter.addEventListener('change', filterTodo);
sort.addEventListener('change', sortTodo);
function addTodo(event) {
    event.preventDefault();
    var inputValue = input.value;
    if (!inputValue) {
        alert('Please provide a todo name below.');
        return;
    }
    allTodos.push({
        id: createId(),
        title: inputValue,
        completed: false
    });
    var lastTodo = allTodos[allTodos.length - 1];
    renderTodo(lastTodo);
    saveTodos(allTodos);
    input.value = '';
}
function renderTodo(todo, index) {
    todoList.insertAdjacentHTML('beforeend', todoMarkup(todo, index));
}
var toggleTodo = function (id) {
    var todo = allTodos.find(function (item) { return item.id === parseInt(id); });
    if (todo) {
        todo.completed = !todo.completed;
    }
};
function deleteTodo(id) {
    var index = allTodos.findIndex(function (item) { return item.id === parseInt(id); });
    if (index > -1) {
        allTodos.splice(index, 1);
    }
}
function clearInnerHtml(parent) {
    parent.innerHTML = '';
}
function todoClick(event) {
    var item = event.target;
    var todo = item.closest('.todo');
    var completeButton = item.closest('.complete');
    var deleteButton = item.closest('.delete');
    if (completeButton && completeButton.parentElement) {
        completeButton.parentElement.classList.toggle('completed');
        toggleTodo(todo.dataset.id);
        saveTodos(allTodos);
    }
    if (deleteButton) {
        todo.classList.add('deleted');
        deleteTodo(todo.dataset.id);
        saveTodos(allTodos);
        todo.addEventListener('transitionend', function () { return todo.remove(); });
    }
}
function filterTodo(event) {
    sort.value = '';
    var target = event.target;
    switch (target.value) {
        case 'all':
            clearInnerHtml(todoList);
            allTodos.forEach(function (todo, index) { return renderTodo(todo, index); });
            todosForFilter = __spreadArrays(allTodos);
            break;
        case 'completed':
            clearInnerHtml(todoList);
            var completeTodos = allTodos.filter(function (curr) { return curr.completed; });
            completeTodos.forEach(function (todo, index) {
                return renderTodo(todo, index);
            });
            todosForFilter = completeTodos;
            break;
        case 'uncompleted':
            clearInnerHtml(todoList);
            var uncompleteTodos = allTodos.filter(function (curr) { return !curr.completed; });
            uncompleteTodos.forEach(function (todo, index) {
                return renderTodo(todo, index);
            });
            todosForFilter = uncompleteTodos;
            break;
    }
}
function sortTodo(event) {
    var target = event.target;
    switch (target.value) {
        case 'ascending':
            var ascendingTodos = todosForFilter.sort(function (a, b) {
                var nameA = a.title.toLowerCase();
                var nameB = b.title.toLowerCase();
                if (nameA > nameB)
                    return 1;
                if (nameA < nameB)
                    return -1;
                return 0;
            });
            clearInnerHtml(todoList);
            ascendingTodos.forEach(function (todo, index) {
                return renderTodo(todo, index);
            });
            break;
        case 'descending':
            var descendingTodos = todosForFilter.sort(function (a, b) {
                var nameA = a.title.toLowerCase();
                var nameB = b.title.toLowerCase();
                if (nameA < nameB)
                    return 1;
                if (nameA > nameB)
                    return -1;
                return 0;
            });
            clearInnerHtml(todoList);
            descendingTodos.forEach(function (todo, index) {
                return renderTodo(todo, index);
            });
            break;
        case 'random':
            var randomTodos = todosForFilter.sort(function () { return Math.random() - 0.5; });
            clearInnerHtml(todoList);
            randomTodos.forEach(function (todo, index) {
                return renderTodo(todo, index);
            });
            break;
    }
}
// Fetch existing todos from localStorage
function getSavedTodos() {
    var data = localStorage.getItem('todos');
    //Check if the value for parsing is correct
    return data ? JSON.parse(data) : [];
}
// Save todos to localStorage
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function todoMarkup(todo, index) {
    if (index === void 0) { index = 0; }
    var title = todo.title, id = todo.id, completed = todo.completed;
    var completedClass = completed ? 'completed' : '';
    return "\n  <li class=\"todo " + completedClass + "\" data-id=" + id + " style=\"--i:" + index + ";\">\n    <p class=\"todo__text\">" + title + "</p>\n    <button class=\"complete\" aria-label=\"Complete\">\n      <svg>\n        <use xlink:href=\"img/sprite.svg#check-square\"></use>\n      </svg>\n    </button>\n    <button class=\"delete\" aria-label=\"Delete\">\n      <svg>\n        <use xlink:href=\"img/sprite.svg#trash-can\"></use>\n      </svg>\n    </button>\n  </li>\n";
}
