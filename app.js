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

renderTodos(allTodos);

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
    deleteTodo(todo.dataset.id);
    saveTodos(allTodos);
    todo.addEventListener("transitionend", () => todo.remove());
  }
}

// function filterTodo(event) {
//   const todos = todoList.children;
//   console.log(todos);
//   todos.forEach((todo) => {
//     // switch (event.target.value) {
//     //   case "all":
//     //     todo.style.display = "flex";
//     //   case "completed":
//     //     todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
//     //   case "uncompleted":
//     //     todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
//     // }
//   });
// }

// Fetch existing todos from localStorage
function getSavedTodos() {
  let data = localStorage.getItem("todos");
  //Check if the value for parsing is correct
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// Save todos to localStorage
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function todoBlueprint(text, id) {
  return `
  <li class="todo active" data-id=${id}>
    <p class="todo__text">${text}</p>
    <button class="complete">
      <svg>
        <use xlink:href="img/sprite.svg#check-square"></use>
      </svg>
    </button>
    <button class="delete">
      <svg>
        <use xlink:href="img/sprite.svg#trash-can"></use>
      </svg>
    </button>
  </li>
`;
}
