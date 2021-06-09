import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/configStore';

import Counter from './counter';

ReactDOM.render(
<Provider store={store}>
  <Counter />
  {/* <Route path="/" component={} exact={true} />
  <Route path="/:id" component={} exact={true} /> */}
</Provider>
, document.getElementById('root'));