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