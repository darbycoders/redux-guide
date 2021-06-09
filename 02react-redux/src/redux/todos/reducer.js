import { actionTypes } from './action';

const initialState = []

function todos(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_TODO:
      return state.concat(action.todo);
    case actionTypes.TOGGLE_TODO:
      return state.map(
        todo =>
          todo.id == action.id 
            ? {...todo, done: !todo.done} 
            : todo
      )
    default:
      return state
  }
}

export default todos;