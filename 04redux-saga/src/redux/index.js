import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import { counterSaga } from './counter/action';
import counter from './counter/reducer';

import { postsSaga } from './posts/action';
import posts from './posts/reducer';

const rootReducer = combineReducers({ 
  counter,
  posts
});

export function* rootSaga() {
  yield all([counterSaga(),postsSaga()]);
}

export default rootReducer;