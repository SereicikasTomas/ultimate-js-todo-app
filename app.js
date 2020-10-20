const form = document.querySelector(".form");
const input = document.querySelector(".form__input");
const todoList = document.querySelector(".todo-list");
const filter = document.querySelector(".filter");
const createId = () => {
  const date = new Date();
  return date.getTime();
};

const allTodos = getSavedTodos();

renderTodos(allTodos);

form.addEventListener("submit", addTodo);
todoList.addEventListener("click", todoClick);

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

  const { title, id } = allTodos[allTodos.length - 1];
  todoList.insertAdjacentHTML("beforeend", todoBlueprint(title, id));
  saveTodos(allTodos);
  input.value = "";
}

function renderTodos(todos) {
  todos.forEach(({ title, id }) =>
    todoList.insertAdjacentHTML("beforeend", todoBlueprint(title, id))
  );
}

function deleteTodo(id) {
  const index = allTodos.findIndex((item) => item.id == id);

  if (index > -1) {
    allTodos.splice(index, 1);
  }
}

function todoClick(event) {
  const item = event.target;

  const completeButton = item.closest(".complete");
  const deleteButton = item.closest(".delete");

  if (completeButton)
    completeButton.parentElement.classList.toggle("completed");

  if (deleteButton) {
    const todo = deleteButton.parentElement;
    todo.classList.add("deleted");
    todo.addEventListener("transitionend", () => todo.remove());
  }
}
