## 02.react-redux

### 🐶 Counter 기능구현 예제

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

#### src/redux/index.js

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
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increase, decrease, setDiff } from './redux/counter/action';

export default function Counter() {
  const { number, diff } = useSelector(state => state.counter);
  
  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increase());
  }
  const onDecrease = () => {
    dispatch(decrease());
  }

  const onSetDiff = e => {
    dispatch(setDiff(parseInt(e.target.value,10)));
  }

  return(
    <>
      <p>{number}</p>
      <input type="number" value={diff} onChange={onSetDiff} />
      <button type="button" onClick={onIncrease}>PLUS</button>
      <button type="button" onClick={onDecrease}>MINUS</button>
    </>
  )
}
```

#### src/index.js

``` javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from './redux';
import Counter from './counter';

const store = createStore(rootReducer);

ReactDOM.render(
<Provider store={store}>
  <Counter />
</Provider>  
,document.getElementById('root'));
```

---

### 🐶 Todo List 기능구현 예제

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

#### src/redux/index.js

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
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addTodo, toggleTodo } from './redux/todos/action';

const TodoList = React.memo(function TodoList({todos,onToggle}) {
  return(
    <ul>
      {todos.map(todo=>(
        <li 
          style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          onClick={()=>onToggle(todo.id)} key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
});

export default function Todos() {
  const [text,setText] = useState('');

  const todos = useSelector(state => state.todos);

  const dispatch = useDispatch();

  const onChange = e => {
    setText(e.target.value);
  }

  const onSubmit = e => {
    e.preventDefault();
    dispatch(addTodo(text));
    setText('');
  }

  const onToggle = useCallback(id=>{
    dispatch(toggleTodo(id));    
  },[dispatch])

  return(
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button>Todo Add</button>
      </form>
      <TodoList todos={todos} onToggle={onToggle} />
    </>    
  )
}
```

#### src/index.js

``` javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from './redux';
import Counter from './counter';
import Todos from './todos';

const store = createStore(rootReducer);

ReactDOM.render(
<Provider store={store}>
  <Counter />
  <Todos />
</Provider>  
,document.getElementById('root'));
```