// Action Type
export const actionTypes = {
  SET_DIFF: 'counter/SET_DIFF',
  INCREASE: 'counter/INCREASE',
  DECREASE: 'counter/DECREASE'
};

// Action Function
export function setDiff(payload) {
  return {
    type: actionTypes.SET_DIFF,
    payload
  }
};
export function increase() {
  return {
    type: actionTypes.INCREASE
  }
};
export function decrease() {
  return {
    type: actionTypes.DECREASE
  }
};