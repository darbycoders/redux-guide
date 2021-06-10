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