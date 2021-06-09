## 리덕스의 기본원리

### Action - 액션

##### 상태에 어떠한 변화가 필요하게 될 땐, 우리는 액션이란 것을 발생시킵니다. 이는, 하나의 객체로 표현되는데요, 액션 객체는 다음과 같은 형식으로 이뤄져있습니다.

``` javascript
{type:'TOGGLE_VALUE'}
```

##### 액션 객체는 type 필드를 필수적으로 가지고 있어야하고 그 외의 값들은 개발자 마음대로 넣어줄 수 있습니다.

``` javascript
{
  type: "ADD_TODO",
  data: {
    id: 0,
    text: 'Study Redux'
  }
}

{
  type: "CHANGE_INPUT",
  text: '안녕하세요'
}
```

### Action Creator - 액션생성함수

##### 액션 생성함수는, 액션을 만드는 함수입니다. 단순히 파라미터를 받아와서 액션 객체 형태로 만들어줍니다.

``` javascript
export function addTodo(data) {
  return {
    type: "ADD_TODO",
    data
  };
}
```

##### 이러한 액션 생성함수를 만들어서 사용하는 이유는 나중에 컴포넌트에서 더욱 쉽게 액션을 발생시키기 위함입니다. 그래서 보통 함수 앞에 export 키워드를 붙여서 다른 파일에서 불러와서 사용합니다.

##### 리덕스를 사용 할 때 액션 생성함수를 사용하는것이 필수적이진 않습니다. 액션을 발생 시킬 때마다 직접 액션 객체를 작성할수도 있습니다.

### reducer - 리듀서

##### 리듀서는 변화를 일으키는 함수입니다. 리듀서는 두가지의 파라미터를 받아옵니다.

##### 리듀서는, 현재의 상태와, 전달 받은 액션을 참고하여 새로운 상태를 만들어서 반환합니다. 이 리듀서는 useReducer 를 사용할때 작성하는 리듀서와 똑같은 형태를 가지고 있습니다.

``` javascript
function counter(state, action) {
  switch (action.type) {
    case 'INCREASE':
      return state + 1;
    case 'DECREASE':
      return state - 1;
    default:
      return state;
  }
}
```

##### useReducer 에선 일반적으로 default: 부분에 throw new Error('Unhandled Action')과 같이 에러를 발생시키도록 처리하는게 일반적인 반면 리덕스의 리듀서에서는 기존 state를 그대로 반환하도록 작성해야합니다.

##### 리덕스를 사용 할 때에는 여러개의 리듀서를 만들고 이를 합쳐서 루트 리듀서 (Root Reducer)를 만들 수 있습니다. (루트 리듀서 안의 작은 리듀서들은 서브 리듀서라고 부릅니다.)

### store - 스토어

``` javascript
import { createStore } from 'redux';

const store = createStore(리듀서함수);
console.log(store.getState()); // 스토어 상태조회
```

##### 리덕스에서는 한 애플리케이션당 하나의 스토어를 만들게 됩니다. 스토어 안에는, 현재의 앱 상태와, 리듀서가 들어가있고, 추가적으로 몇가지 내장 함수들이 있습니다.

### dispatch - 디스패치

``` javascript
store.dispatch(액션함수);
```

##### 디스패치는 스토어의 내장함수 중 하나입니다. 디스패치는 액션을 발생 시키는 것 이라고 이해하시면 됩니다. dispatch 라는 함수에는 액션을 파라미터로 전달합니다.. dispatch(action) 이런식으로 말이죠.

### subscribe - 구독

``` javascript
// * 스토어안에 들어있는 상태가 바뀔 때 마다 호출되는 listener 함수
const listener = () => {
  const state = store.getState();
  console.log(state);
};

const unsubscribe = store.subscribe(listener);
// * 구독을 해제하고 싶을 때는 unsubscribe() 를 호출하면 됩니다.
```

##### 구독 또한 스토어의 내장함수 중 하나입니다. subscribe 함수는, 함수 형태의 값을 파라미터로 받아옵니다. subscribe 함수에 특정 함수를 전달해주면, 액션이 디스패치 되었을 때 마다 전달해준 함수가 호출됩니다.

##### 리액트에서 리덕스를 사용하게 될 때 보통 이 함수를 직접 사용하는 일은 별로 없습니다. 그 대신에 react-redux 라는 라이브러리에서 제공하는 connect 함수 또는 useSelector Hook 을 사용하여 리덕스 스토어의 상태에 구독합니다.

---

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

---

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

---

## 03.redux-thunk

### 🐶 Counter 기능구현 예제

#### src/redux/counter/action.js

``` javascript
export const actionTypes = {
  INCREASE: 'counter/INCREASE',
  DECREASE: 'counter/DECREASE'
}

function increase() {
  return {
    type: actionTypes.INCREASE
  }
}

function decrease() {
  return {
    type: actionTypes.DECREASE
  }
}

export const increaseAsync = () => dispatch => {
  setTimeout(()=>(dispatch(increase())),1000)
}
export const decreaseAsync = () => dispatch => {
  setTimeout(()=>(dispatch(decrease())),1000)
}
```

#### src/redux/counter/reducer.js

``` javascript
import { actionTypes } from "./action";

const initialState = 0;

export default function counter( state = initialState, action ) {
  switch(action.type) {
    case actionTypes.INCREASE :
      return state + 1;
    case actionTypes.DECREASE :
      return state - 1;
    default:
      return state;
  }
}
```

#### src/redux/configStore.js

``` javascript
import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';

import rootReducer from './../redux';

const middlewares = [reduxThunk];
const enhancer = process.env.NODE_ENV === 'production'
  ? compose(applyMiddleware(...middlewares))
  : composeWithDevTools(applyMiddleware(...middlewares));

export const store = createStore(rootReducer, enhancer);
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
import { useSelector, useDispatch } from 'react-redux';

import { decreaseAsync, increaseAsync } from './redux/counter/action';

export default function Counter() {
  const number = useSelector(state => state.counter);
  
  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increaseAsync());
  };
  const onDecrease = () => {
    dispatch(decreaseAsync());
  };

  return(
    <>
      <span>{number}</span>
      <button onClick={onIncrease}>PLUS</button>
      <button onClick={onDecrease}>MINUS</button>
    </>
  )
}
```

#### src/index.js

``` javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/configStore';

import Counter from './counter';

ReactDOM.render(
<Provider store={store}>
  <Counter />
</Provider>
, document.getElementById('root'));
```