import { createStore, compose, applyMiddleware } from 'redux';
// import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';

import rootReducer from './../redux';

// const configStore = () => {
  const middlewares = [reduxThunk];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(applyMiddleware(...middlewares));

  export const store = createStore(rootReducer, enhancer);
  // return store;
// }

// const wrapper = createWrapper(configStore, {
//   debug: process.env.NODE_ENV === 'development'
// });
