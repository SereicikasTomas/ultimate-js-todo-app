const form = <HTMLFormElement>document.querySelector('.form');
const input = <HTMLInputElement>document.querySelector('.form__input');
const todoList = <HTMLElement>document.querySelector('.todo-list');
const filter = <HTMLSelectElement>document.querySelector('.filter');
const sort = <HTMLSelectElement>document.querySelector('.sort');
const createId = () => {
  const date = new Date();
  return date.getTime();
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const allTodos = getSavedTodos();
let todosForFilter = allTodos;
allTodos.forEach((todo: Todo, index: number) => renderTodo(todo, index));

form.addEventListener('submit', addTodo);
todoList.addEventListener('click', todoClick);
filter.addEventListener('change', filterTodo);
sort.addEventListener('change', sortTodo);

function addTodo(event: Event) {
  event.preventDefault();
  const inputValue = input.value;

  if (!inputValue) {
    alert('Please provide a todo name below.');
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
  input.value = '';
}

function renderTodo(todo: Todo, index?: number) {
  todoList.insertAdjacentHTML('beforeend', todoMarkup(todo, index));
}

const toggleTodo = (id: string ) => {
  const todo = allTodos.find((item: Todo) => item.id === parseInt(id));

  if (todo) {
    todo.completed = !todo.completed;
  }
};

function deleteTodo(id: string) {
  const index = allTodos.findIndex((item: Todo) => item.id === parseInt(id));

  if (index > -1) {
    allTodos.splice(index, 1);
  }
}

function clearInnerHtml(parent: HTMLElement) {
  parent.innerHTML = '';
}

function todoClick(event: Event) {
  const item = event.target as HTMLElement;
  const todo = item.closest('.todo') as HTMLLIElement;
  const completeButton = item.closest('.complete') as HTMLElement;
  const deleteButton = item.closest('.delete');

  if (completeButton && completeButton.parentElement) {
    completeButton.parentElement.classList.toggle('completed');
    toggleTodo(todo.dataset.id!);
    saveTodos(allTodos);
  }

  if (deleteButton) {
    todo.classList.add('deleted');
    deleteTodo(todo.dataset.id!);
    saveTodos(allTodos);
    todo.addEventListener('transitionend', () => todo.remove());
  }
}

function filterTodo(event: Event) {
  sort.value = '';
  const target = <HTMLSelectElement>event.target;
  switch (target.value) {
    case 'all':
      clearInnerHtml(todoList);
      allTodos.forEach((todo: Todo, index: number) => renderTodo(todo, index));
      todosForFilter = [...allTodos];
      break;
    case 'completed':
      clearInnerHtml(todoList);
      const completeTodos = allTodos.filter((curr: Todo) => curr.completed);
      completeTodos.forEach((todo: Todo, index: number) =>
        renderTodo(todo, index)
      );
      todosForFilter = completeTodos;
      break;
    case 'uncompleted':
      clearInnerHtml(todoList);
      const uncompleteTodos = allTodos.filter((curr: Todo) => !curr.completed);
      uncompleteTodos.forEach((todo: Todo, index: number) =>
        renderTodo(todo, index)
      );
      todosForFilter = uncompleteTodos;
      break;
  }
}

function sortTodo(event: Event) {
  const target = <HTMLSelectElement>event.target;
  switch (target.value) {
    case 'ascending':
      const ascendingTodos = todosForFilter.sort(function (a: Todo, b: Todo) {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (nameA > nameB) return 1;
        if (nameA < nameB) return -1;
        return 0;
      });
      clearInnerHtml(todoList);
      ascendingTodos.forEach((todo: Todo, index: number) =>
        renderTodo(todo, index)
      );
      break;
    case 'descending':
      const descendingTodos = todosForFilter.sort(function (a: Todo, b: Todo) {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0;
      });
      clearInnerHtml(todoList);
      descendingTodos.forEach((todo: Todo, index: number) =>
        renderTodo(todo, index)
      );
      break;
    case 'random':
      const randomTodos = todosForFilter.sort(() => Math.random() - 0.5);
      clearInnerHtml(todoList);
      randomTodos.forEach((todo: Todo, index: number) =>
        renderTodo(todo, index)
      );
      break;
  }
}

// Fetch existing todos from localStorage
function getSavedTodos() {
  let data = localStorage.getItem('todos');
  //Check if the value for parsing is correct
  return data ? JSON.parse(data) : [];
}

// Save todos to localStorage
function saveTodos(todos: Todo[]) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function todoMarkup(todo: Todo, index = 0) {
  const { title, id, completed } = todo;
  const completedClass = completed ? 'completed' : '';
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
