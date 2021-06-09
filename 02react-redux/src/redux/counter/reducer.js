import { actionTypes } from './action';

const initialState = {
  number: 0,
  diff: 1
};

function counter(state = initialState, action) {
  switch(action.type) {
    case actionTypes.SET_DIFF:
      return {
        ...state,
        diff: action.payload
      }
    case actionTypes.INCREASE:
      return {
        ...state,
        number: state.number + state.diff
      }
    case actionTypes.DECREASE:
      return {
        ...state,
        number: state.number - state.diff
      }
    default: 
      return state
  }
};

export default counter;