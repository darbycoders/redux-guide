import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addTodo, toggleTodo } from './redux/todos/action';

const TodoList = React.memo(function TodoList({todos,onToggle}) {
  return(
    <ul>
      {todos.map(todo=>(
        <li 
          style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          onClick={()=>onToggle(todo.id)} key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
});

export default function Todos() {
  const [text,setText] = useState('');

  const todos = useSelector(state => state.todos);

  const dispatch = useDispatch();

  const onChange = e => {
    setText(e.target.value);
  }

  const onSubmit = e => {
    e.preventDefault();
    dispatch(addTodo(text));
    setText('');
  }

  const onToggle = useCallback(id=>{
    dispatch(toggleTodo(id));    
  },[dispatch])

  return(
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button>Todo Add</button>
      </form>
      <TodoList todos={todos} onToggle={onToggle} />
    </>    
  )
}