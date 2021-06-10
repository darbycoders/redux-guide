## 01.vanilla-redux

### 🐶 Counter 기능구현 예제

#### dist/counter.html

``` html
<html>
  <body>    
    <span id="countNum">0</span>
    <input type="number" id="onCountChange" min="1" />
    <button type="button" id="onIncrease"> + </button>
    <button type="button" id="onDecrease"> - </button>
  </body>
  <script src="./js/counter.js"></script>
</html>
```

#### src/redux/counter/action.js

``` javascript
// Action Type
export const actionTypes = {
  SET_DIFF: 'counter/SET_DIFF',
  INCREASE: 'counter/INCREASE',
  DECREASE: 'counter/DECREASE'
};

// Action Function
export function setDiff(payload) {
  return {
    type: actionTypes.SET_DIFF,
    payload
  }
};
export function increase() {
  return {
    type: actionTypes.INCREASE
  }
};
export function decrease() {
  return {
    type: actionTypes.DECREASE
  }
};
```

#### src/redux/counter/reducer.js

``` javascript
import { actionTypes } from './action';

const initialState = {
  number: 0,
  diff: 1
};

function counter(state = initialState, action) {
  switch(action.type) {
    case actionTypes.SET_DIFF:
      return {
        ...state,
        diff: action.payload
      }
    case actionTypes.INCREASE:
      return {
        ...state,
        number: state.number + state.diff
      }
    case actionTypes.DECREASE:
      return {
        ...state,
        number: state.number - state.diff
      }
    default: 
      return state
  }
};

export default counter;
```

#### src/redux/rootReducer.js

``` javascript
import { combineReducers } from 'redux';

import counter from './counter/reducer';

const rootReducer = combineReducers({
  counter
});

export default rootReducer;
```

#### src/counter.js

``` javascript
import { createStore } from 'redux';
import rootReducer from './redux/rootReducer';
import { increase, decrease, setDiff } from './redux/counter/action';

const store = createStore(rootReducer);

function listener() {
  const state = store.getState();

  document.getElementById('countNum').innerHTML = state.counter.number;
}

store.subscribe(listener);

document.getElementById('onIncrease').addEventListener('click',function(e){
  store.dispatch(increase());
});
document.getElementById('onDecrease').addEventListener('click',function(e){
  store.dispatch(decrease());
});
document.getElementById('onCountChange').addEventListener('change',function(e){
  store.dispatch(setDiff(parseInt(e.target.value,10)));
});
```

---

### 🐶 Todo List 기능구현 예제

#### dist/todos.html

``` html
<html>
  <body>
    <input type="text" id="onTodosInput" placeholder="할 일을 입력하세요.." />
    <button type="button" id="onTodosSubmit">등록</button>
    <ul id="todoList"></ul>
  </body>
  <script src="./js/todos.js"></script>
</html>
```

#### src/redux/todos/action.js

``` javascript
// Action Type
export const actionTypes = {
  ADD_TODO: 'todos/ADD_TODO',
  TOGGLE_TODO: 'todos/TOGGLE_TODO'
};

// Action Function
let nextId = 1;
export function addTodo(text) {
  return {
    type: actionTypes.ADD_TODO,
    todo: {
      id: nextId++,
      text
    }
  }
};
export function toggleTodo(id) {
  return {
    type: actionTypes.TOGGLE_TODO,
    id
  }
};
```

#### src/redux/todos/reducer.js

``` javascript
import { actionTypes } from './action';

const initialState = []

function todos(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_TODO:
      return state.concat(action.todo);
    case actionTypes.TOGGLE_TODO:
      return state.map(
        todo =>
          todo.id == action.id 
            ? {...todo, done: !todo.done} 
            : todo
      )
    default:
      return state
  }
}

export default todos;
```

#### src/redux/rootReducer.js

``` javascript
import { combineReducers } from 'redux';

import counter from './counter/reducer';
import todos from './todos/reducer';

const rootReducer = combineReducers({
  counter,
  todos
});

export default rootReducer;
```

#### src/todos.js

``` javascript
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
```