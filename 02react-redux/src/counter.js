import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increase, decrease, setDiff } from './redux/counter/action';

export default function Counter() {
  const { number, diff } = useSelector(state => state.counter);
  
  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increase());
  }
  const onDecrease = () => {
    dispatch(decrease());
  }

  const onSetDiff = e => {
    dispatch(setDiff(parseInt(e.target.value,10)));
  }

  return(
    <>
      <p>{number}</p>
      <input type="number" value={diff} onChange={onSetDiff} />
      <button type="button" onClick={onIncrease}>PLUS</button>
      <button type="button" onClick={onDecrease}>MINUS</button>
    </>
  )
}