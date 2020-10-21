const form = document.querySelector(".form");
const input = document.querySelector(".form__input");
const todoList = document.querySelector(".todo-list");
const filter = document.querySelector(".filter");
const createId = () => {
  const date = new Date();
  return date.getTime();
};

const allTodos = getSavedTodos();
allTodos.forEach((todo, index) => renderTodo(todo, index));

form.addEventListener("submit", addTodo);
todoList.addEventListener("click", todoClick);
filter.addEventListener("change", filterTodo);

function addTodo(event) {
  event.preventDefault();
  const inputValue = event.target[0].value;

  if (!inputValue) {
    alert("Please provide a todo name below.");
    return;
  }

  allTodos.push({
    id: createId(),
    title: inputValue,
    completed: false,
  });

  const lastTodo = allTodos[allTodos.length - 1];
  renderTodo(lastTodo);
  saveTodos(allTodos);
  input.value = "";
}

function renderTodo(todo, index) {
  todoList.insertAdjacentHTML("beforeend", todoBlueprint(todo, index));
}

const toggleTodo = (id) => {
  const todo = allTodos.find((item) => item.id == id);

  if (todo) {
    todo.completed = !todo.completed;
  }
};

function deleteTodo(id) {
  const index = allTodos.findIndex((item) => item.id == id);

  if (index > -1) {
    allTodos.splice(index, 1);
  }
}

function clearInnerHtml(parent) {
  parent.innerHTML = "";
}

function todoClick(event) {
  const item = event.target;
  const todo = item.closest(".todo");
  const { id } = todo.dataset;
  const completeButton = item.closest(".complete");
  const deleteButton = item.closest(".delete");

  if (completeButton) {
    completeButton.parentElement.classList.toggle("completed");
    toggleTodo(id);
    saveTodos(allTodos);
  }

  if (deleteButton) {
    todo.classList.add("deleted");
    deleteTodo(id);
    saveTodos(allTodos);
    todo.addEventListener("transitionend", () => todo.remove());
  }
}

function filterTodo(event) {
  const completeTodos = allTodos.filter((curr) => curr.completed);
  const uncompleteTodos = allTodos.filter((curr) => !curr.completed);
  switch (event.target.value) {
    case "all":
      clearInnerHtml(todoList);
      allTodos.forEach((todo, index) => renderTodo(todo, index));
      break;
    case "completed":
      clearInnerHtml(todoList);
      completeTodos.forEach((todo, index) => renderTodo(todo, index));
      break;
    case "uncompleted":
      clearInnerHtml(todoList);
      uncompleteTodos.forEach((todo, index) => renderTodo(todo, index));
      break;
  }
}

// Fetch existing todos from localStorage
function getSavedTodos() {
  let data = localStorage.getItem("todos");
  //Check if the value for parsing is correct
  return data ? JSON.parse(data) : [];
}

// Save todos to localStorage
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function todoBlueprint(todo, index = 0) {
  const { title, id, completed } = todo;
  const completedClass = completed ? "completed" : "";
  return `
  <li class="todo ${completedClass}" data-id=${id} style="--i:${index};">
    <p class="todo__text">${title}</p>
    <button class="complete" aria-label="Complete">
      <svg>
        <use xlink:href="img/sprite.svg#check-square"></use>
      </svg>
    </button>
    <button class="delete" aria-label="Delete">
      <svg>
        <use xlink:href="img/sprite.svg#trash-can"></use>
      </svg>
    </button>
  </li>
`;
}
