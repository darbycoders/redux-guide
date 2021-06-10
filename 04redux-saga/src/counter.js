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