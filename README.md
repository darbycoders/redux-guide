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

### 🐶 웹요청 기능구현 예제

#### src/api/posts.js

``` javascript
// n 밀리세컨드동안 기다리는 프로미스를 만들어주는 함수
const sleep = n => new Promise(resolve => setTimeout(resolve, n));

// 가짜 포스트 목록 데이터
const posts = [
  {
    id: 1,
    title: 'title01',
    body: 'content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.'
  },
  {
    id: 2,
    title: 'title02',
    body: 'content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.'
  },
  {
    id: 3,
    title: 'title03',
    body: 'content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.'
  }
];

// 포스트 목록을 가져오는 비동기 함수
export const getPosts = async () => {
  await sleep(500); // 0.5초 쉬고
  return posts; // posts 배열
};

// ID로 포스트를 조회하는 비동기 함수
export const getPostById = async id => {
  await sleep(500); // 0.5초 쉬고
  return posts.find(post => post.id === id); // id 로 찾아서 반환
};
```

#### src/lib/asyncUtils.js

##### 리덕스 모듈에 반복되는 코드를 리팩토링하는 유틸소스입니다.

``` javascript
// Promise에 기반한 Thunk를 만들어주는 함수입니다.
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  // 이 함수는 promiseCreator가 단 하나의 파라미터만 받는다는 전제하에 작성되었습니다.
  // 만약 여러 종류의 파라미터를 전달해야하는 상황에서는 객체 타입의 파라미터를 받아오도록 하면 됩니다.
  // 예: writeComment({ postId: 1, text: '댓글 내용' });
  return param => async dispatch => {
    // 요청 시작
    dispatch({ type, param });
    try {
      // 결과물의 이름을 payload 라는 이름으로 통일시킵니다.
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload }); // 성공
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true }); // 실패
    }
  };
};


// 리듀서에서 사용 할 수 있는 여러 유틸 함수들입니다.
export const reducerUtils = {
  // 초기 상태. 초기 data 값은 기본적으로 null 이지만
  // 바꿀 수도 있습니다.
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null
  }),
  // 로딩중 상태. prevState의 경우엔 기본값은 null 이지만
  // 따로 값을 지정하면 null 로 바꾸지 않고 다른 값을 유지시킬 수 있습니다.
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null
  }),
  // 성공 상태
  success: payload => ({
    loading: false,
    data: payload,
    error: null
  }),
  // 실패 상태
  error: error => ({
    loading: false,
    data: null,
    error: error
  })
};

// 비동기 관련 액션들을 처리하는 리듀서를 만들어줍니다.
// type 은 액션의 타입, key 는 상태의 key (예: posts, post) 입니다.
export const handleAsyncActions = (type, key) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading()
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload)
        };
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload)
        };
      default:
        return state;
    }
  };
};
```

#### src/redux/posts/action.js
``` javascript
/* 리팩토링 하기 전 */
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기

export const actionTypes = {
  // 포스트 여러개 조회하기
  GET_POSTS: 'posts/GET_POSTS', // 요청 시작
  GET_POSTS_SUCCESS:'posts/GET_POSTS_SUCCESS', // 요청 성공
  GET_POSTS_ERROR: 'posts/GET_POSTS_ERROR', // 요청 실패
  // 포스트 하나 조회하기
  GET_POST: 'posts/GET_POST',
  GET_POST_SUCCESS:'posts/GET_POST_SUCCESS',
  GET_POST_ERROR: 'posts/GET_POST_ERROR',
}

// thunk 를 사용 할 때, 꼭 모든 액션들에 대하여 액션 생성함수를 만들 필요는 없습니다.
// 그냥 thunk 함수에서 바로 액션 객체를 만들어주어도 괜찮습니다.
export const getPosts = () => async dispatch => {
  dispatch({ type: actionTypes.GET_POSTS }); // 요청이 시작됨
  try {
    const posts = await postsAPI.getPosts(); // API 호출
    dispatch({ type: actionTypes.GET_POSTS_SUCCESS, posts }); // 성공
  } catch (e) {
    dispatch({ type: actionTypes.GET_POSTS_ERROR, error: e }); // 실패
  }
};

// thunk 함수에서도 파라미터를 받아와서 사용 할 수 있습니다.
export const getPost = id => async dispatch => {
  dispatch({ type: actionTypes.GET_POST }); // 요청이 시작됨
  try {
    const post = await postsAPI.getPostById(id); // API 호출
    dispatch({ type: actionTypes.GET_POST_SUCCESS, post }); // 성공
  } catch (e) {
    dispatch({ type: actionTypes.GET_POST_ERROR, error: e }); // 실패
  }
};

/* 리팩토링 한 후 */
import * as postsAPI from '../../api/posts'; // api/posts 안의 함수 모두 불러오기
import { createPromiseThunk } from '../../lib/asyncUtils';

export const actionTypes = {
  // 포스트 여러개 조회하기
  GET_POSTS: 'posts/GET_POSTS', // 요청 시작
  GET_POSTS_SUCCESS:'posts/GET_POSTS_SUCCESS', // 요청 성공
  GET_POSTS_ERROR: 'posts/GET_POSTS_ERROR', // 요청 실패
  // 포스트 하나 조회하기
  GET_POST: 'posts/GET_POST',
  GET_POST_SUCCESS:'posts/GET_POST_SUCCESS',
  GET_POST_ERROR: 'posts/GET_POST_ERROR',
}

// 아주 쉽게 thunk 함수를 만들 수 있게 되었습니다.
export const getPosts = createPromiseThunk(actionTypes.GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(actionTypes.GET_POST, postsAPI.getPostById);
```

#### src/redux/posts/reducer.js

``` javascript
/* 리팩토링 하기 전 */
import { actionTypes } from './action';

const initialState = {
  posts: {
    loading: false,
    data: null,
    error: null
  },
  post: {
    loading: false,
    data: null,
    error: null
  }
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_POSTS:
      return {
        ...state,
        posts: {
          loading: true,
          data: null,
          error: null
        }
      };
    case actionTypes.GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: {
          loading: false,
          data: action.posts,
          error: null
        }
      };
    case actionTypes.GET_POSTS_ERROR:
      return {
        ...state,
        posts: {
          loading: false,
          data: null,
          error: action.error
        }
      };
    case actionTypes.GET_POST:
      return {
        ...state,
        post: {
          loading: true,
          data: null,
          error: null
        }
      };
    case actionTypes.GET_POST_SUCCESS:
      return {
        ...state,
        post: {
          loading: false,
          data: action.post,
          error: null
        }
      };
    case actionTypes.GET_POST_ERROR:
      return {
        ...state,
        post: {
          loading: false,
          data: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}

/* 리팩토링 한 후 */
import { actionTypes } from './action';
import { reducerUtils, handleAsyncActions } from '../../lib/asyncUtils';

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial()
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_POSTS:
    case actionTypes.GET_POSTS_SUCCESS:
    case actionTypes.GET_POSTS_ERROR:
      return handleAsyncActions(actionTypes.GET_POSTS, 'posts')(state, action);
      // 이렇게도 사용가능합니다.
      // const postsReducer = handleAsyncActions(GET_POSTS, 'posts');
      // return postsReducer(state, action);
    case actionTypes.GET_POST:
    case actionTypes.GET_POST_SUCCESS:
    case actionTypes.GET_POST_ERROR:
      return handleAsyncActions(actionTypes.GET_POST, 'post')(state, action);
    default:
      return state;
  }
}
```

#### src/components/postList.js

``` javascript
import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={`/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

#### src/container/postList.js

``` javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostList from '../components/PostList';
import { getPosts } from '../redux/posts/action';

export default function PostListContainer() {
  const { data, loading, error } = useSelector(state => state.posts.posts);

  const dispatch = useDispatch();

  // 컴포넌트 마운트 후 포스트 목록 요청
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);
  
  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;
  return <PostList posts={data} />;
}
```

#### src/pages/postList.js

``` javascript
import React from 'react';
import PostListContainer from '../container/postList';

export default function PostListPage() {
  return <PostListContainer />;
}
```

#### src/components/postView.js

``` javascript
import React from 'react';

export default function PostView({ post }) {
  const { title, body } = post;
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}
```

#### src/container/postView.js

``` javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostView from '../components/postView';
import { getPost } from '../redux/posts/action';

export default function PostContainer({ postId }) {
  const { data, loading, error } = useSelector(state => state.posts.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(postId));
  }, [postId, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <PostView post={data} />;
}
```

#### src/pages/postView.js

``` javascript
import React from 'react';
import PostViewContainer from '../container/postView';

export default function PostViewPage({ match }) {
  const { id } = match.params;

  return <PostViewContainer postId={parseInt(id, 10)} />;
}
```

#### src/index.js

``` javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/configStore';

import Counter from './counter';
import PostListPage from './pages/postList';
import PostViewPage from './pages/postView';


ReactDOM.render(
<Provider store={store}>
  <Counter />
  <Router>
    <Switch>
      <Route path="/" exact component={PostListPage} />
      <Route path="/:id" component={PostViewPage}/>
    </Switch>    
  </Router>
</Provider>
, document.getElementById('root'));
```

### ⭐️ API 컨텐츠 비우기

#### src/redux/posts/action.js(수정)
``` javascript
(...)

export const actionTypes = {
  ...,
  CLEAR_POST: 'posts/CLEAR_POST'
}

export const clearPost = () => {
  return {
    type: actionTypes.CLEAR_POST
  }
}

(...)
```
#### src/redux/posts/redcer.js(수정)

``` javascript
(...)

case actionTypes.CLEAR_POST:
  return {
    ...state,
    post: reducerUtils.initial()
  };

(...)
```

#### src/container/postView.js(수정)

``` javascript
import { getPost, clearPost } from '../redux/posts/action';

(...)

useEffect(() => {
  dispatch(getPost(postId));
  return () => {
    dispatch(clearPost());
  }
}, [postId, dispatch]);

(...)
```

### ⭐️ API 재로딩 문제해결 (리스트)

#### 방법1. 
#### src/container/postList.js(수정)

``` javascript
(...)

useEffect(() => {
  if (data) return;
  dispatch(getPosts());
}, [data, dispatch]);

(...)
```

#### 방법2.

#### src/lib/asyncUtils.js(수정)

``` javascript
export const handleAsyncActions = (type, key, keepData = false) => {

(...)

  return {
    ...state,
    [key]: reducerUtils.loading(keepData ? state[key].data : null)
  };

(...)

};
```

### src/redux/posts/reducer.js(수정)

``` javascript
(...)

return handleAsyncActions(actionTypes.GET_POSTS, 'posts', true)(state, action);

(...)
```

#### src/container/postList.js(수정)

``` javascript
(...)

if (loading && !data) return <div>로딩중...</div>;

(...)
```

### ⭐️ API 재로딩 문제해결 (상세)

#### src/lib/asyncUtils.js(수정)

``` javascript
(...)

const defaultIdSelector = param => param;
export const createPromiseThunkById = (type, promiseCreator, idSelector = defaultIdSelector) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return param => async dispatch => {
    const id = idSelector(param);
    dispatch({ type, meta: id });
    try {
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      dispatch({ type: ERROR, error: true, payload: e, meta: id });
    }
  };
};

(...)

export const handleAsyncActionsById = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    const id = action.meta;
    console.log(id);
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.loading(
              keepData ? state[key][id] && state[key][id].data : null
            )
          }
        };
      case SUCCESS:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.success(action.payload)
          }
        };
      case ERROR:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.error(action.payload)
          }
        };
      default:
        return state;
    }
  };
};

(...)
```

#### src/redux/posts/action.js(수정)

``` javascript
import { createPromiseThunk, createPromiseThunkById } from '../../lib/asyncUtils';

(...)

export const getPost = createPromiseThunkById(actionTypes.GET_POST, postsAPI.getPostById);
```

#### src/redux/posts/reducer.js(수정)

``` javascript
import { reducerUtils, handleAsyncActions, handleAsyncActionsById } from '../../lib/asyncUtils';

(...)

case actionTypes.GET_POST:
case actionTypes.GET_POST_SUCCESS:
case actionTypes.GET_POST_ERROR:
  return handleAsyncActionsById(actionTypes.GET_POST, 'post', true)(state, action);

(...)
```

#### src/container/postView.js(수정)

``` javascript
(...)

const { data, loading, error } = useSelector(
  state => state.posts.post[postId]
) || {
  loading: false,
  data: null,
  error: null
};

const dispatch = useDispatch();

useEffect(() => {
  dispatch(getPost(postId));
}, [postId, dispatch]);

if (loading && !data) return <div>로딩중...</div>;

(...)
```

---

## 04.redux-saga

### Generator 문법이해

``` javascript
function weirdFunction() {
  return 1;
  return 2;
  return 3;
  return 4;
  return 5;
}
```

##### 함수에서 값을 여러번에 걸쳐서 반환하는 것은 불가능합니다. 위 함수는 호출 할 때마다 무조건 1을 반환하게 될 것입니다. 하지만, 제너레이터 함수를 사용하면 함수에서 값을 순차적으로 반환할 수 있습니다. 함수의 흐름을 도중에 멈춰놓았다가 나중에 이어서 진행 할 수도 있습니다.

``` javascript
function* generatorFunction() {
  console.log('Hello Redux');
  yield 1;
  console.log('generator Function');
  yield 2;
  console.log('function*');
  yield 3;
  return 4;
}

const generator = generatorFunction();

// console
> generator.next()
'Hello Redux'
{value:1,done:false}

> generator.next()
'generator Function'
{value:2,done:false}

> generator.next()
'function*'
{value:3,done:false}

> generator.next()
{value:4,done:true}

function* sumGeneratorFunction() {
    console.log('sumGenerator Start.');
    let a = yield;
    console.log('a값을 받았습니다.');
    let b = yield;
    console.log('b값을 받았습니다.');
    yield a + b;
}

const sumGenerator = sumGeneratorFunction();

// console
> sumGenerator.next()
'sumGenerator Start.'
{value:undefined,done:false}

> sumGenerator.next(5)
'a값을 받았습니다.'
{value:undefined,done:false}

> sumGenerator.next(7)
'b값을 받았습니다.'
{value:12,done:true}

function* watchGenerator() {
    console.log('Monitering Start');
    while(true) {
        const action = yield;
        if (action.type === 'HELLO') {
            console.log('HELLO?');
        }
        if (action.type === 'BYE') {
            console.log('BYE BYE.');
        }
    }
}

const watch = watchGenerator();

> watch.next();
'모니터링 시작!'
{value:undefined,done:false}

> watch.next({type: 'HELLO'});
'안녕하세요?'
{value:undefined,done:false}

> watch.next({type: 'BYE'});
'안녕히가세요.'
{value:undefined,done:false}

> watch.next({type: 'BYE'});
'안녕히가세요.'
{value:undefined,done:false}

> watch.next({type: 'BYE'});
'안녕히가세요.'
{value:undefined,done:false}
```

##### 제너레이터 함수를 만들 때에는 function* 이라는 키워드를 사용합니다. 제너레이터 함수를 호출한다고 해서 해당 함수 안의 코드가 바로 시작되지는 않습니다. "generator.next()" 를 호출해야만 코드가 실행되며, yield를 한 값을 반환하고 코드의 흐름을 멈춥니다. 코드의 흐름이 멈추고 나서 "javascript generator.next()" 를 다시 호출하면 흐름이 이어서 다시 시작됩니다.

### 🐶 Counter 기능구현 예제

#### src/redux/counter/action.js

``` javascript
import { delay, put, takeEvery, takeLatest } from 'redux-saga/effects';

// 액션 타입
export const actionTypes = {
  INCREASE: 'counter/INCREASE',
  DECREASE: 'counter/DECREASE',

  INCREASE_ASYNC: 'counter/INCREASE_ASYNC',
  DECREASE_ASYNC: 'counter/DECREASE_ASYNC'
}

// 액션 생성 함수
export const increase = () => ({ type: actionTypes.INCREASE });
export const decrease = () => ({ type: actionTypes.DECREASE });
export const increaseAsync = () => ({ type: actionTypes.INCREASE_ASYNC });
export const decreaseAsync = () => ({ type: actionTypes.DECREASE_ASYNC });

function* increaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(increase()); // put은 특정 액션을 디스패치 해줍니다.
}
function* decreaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(decrease()); // put은 특정 액션을 디스패치 해줍니다.
}

// 두가지 액션을 모니터링
export function* counterSaga() {
  yield takeEvery(actionTypes.INCREASE_ASYNC, increaseSaga); // 모든 INCREASE_ASYNC 액션을 처리
  yield takeLatest(actionTypes.DECREASE_ASYNC, decreaseSaga); // 가장 마지막으로 디스패치된 DECREASE_ASYNC 액션만을 처리
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
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import rootReducer, { rootSaga } from './../redux';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const enhancer = process.env.NODE_ENV === 'production'
  ? compose(applyMiddleware(...middlewares))
  : composeWithDevTools(applyMiddleware(...middlewares,logger));

export const store = createStore(rootReducer, enhancer);


sagaMiddleware.run(rootSaga);
```

#### src/redux/index.js

``` javascript
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import { counterSaga } from './counter/action';
import counter from './counter/reducer';

const rootReducer = combineReducers({
  counter
});

export function* rootSaga() {
  yield all([counterSaga()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
}

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