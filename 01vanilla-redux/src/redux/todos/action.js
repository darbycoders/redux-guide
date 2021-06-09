// Action Type
export const actionTypes = {
  ADD_TODO: 'todos/ADD_TODO',
  TOGGLE_TODO: 'todos/TOGGLE_TODO'
};

// Action Function
let nextId = 1;
export function addTodo(text) {
  return {
    type: actionTypes.ADD_TODO,
    todo: {
      id: nextId++,
      text
    }
  }
};
export function toggleTodo(id) {
  return {
    type: actionTypes.TOGGLE_TODO,
    id
  }
};