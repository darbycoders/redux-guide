import { actionTypes } from "./action";

const initialState = 0;

export default function counter( state = initialState, action ) {
  switch(action.type) {
    case actionTypes.INCREASE :
      return state + 1;
    case actionTypes.DECREASE :
      return state - 1;
    default:
      return state;
  }
}