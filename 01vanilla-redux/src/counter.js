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