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