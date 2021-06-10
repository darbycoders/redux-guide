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