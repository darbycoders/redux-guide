import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import { counterSaga } from './counter/action';
import counter from './counter/reducer';

const rootReducer = combineReducers({ 
  counter
});

export function* rootSaga() {
  yield all([counterSaga()]);
}

export default rootReducer;