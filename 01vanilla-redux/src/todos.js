import { createStore } from 'redux';
import rootReducer from './redux/rootReducer';
import { addTodo, toggleTodo } from './redux/todos/action';

const store = createStore(rootReducer);

function listener() {
  const state = store.getState();
  
  console.log(state);

  const markup = state.todos.map(todo=>{
    return `
      <li 
        data-id=${todo.id} 
        id=todo${todo.id} 
        class="todo-item"
        style="cursor:pointer">${todo.text}</li>
    `
  }).join("");

  document.getElementById('todoList').innerHTML = markup;
}

document.getElementById('onTodosSubmit').addEventListener('click',function(e){
  const todosVal = document.getElementById('onTodosInput').value;

  store.dispatch(addTodo(todosVal));
});

dcUtil.on(document,'.todo-item','click',function(e){
  const target = e.target;

  store.dispatch(toggleTodo(target.dataset.id));
});

listener();
store.subscribe(listener);