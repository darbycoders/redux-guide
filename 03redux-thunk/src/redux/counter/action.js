export const actionTypes = {
  INCREASE: 'counter/INCREASE',
  DECREASE: 'counter/DECREASE'
}

function increase() {
  return {
    type: actionTypes.INCREASE
  }
}

function decrease() {
  return {
    type: actionTypes.DECREASE
  }
}

export const increaseAsync = () => dispatch => {
  setTimeout(()=>(dispatch(increase())),1000)
}
export const decreaseAsync = () => dispatch => {
  setTimeout(()=>(dispatch(decrease())),1000)
}