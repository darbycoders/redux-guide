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