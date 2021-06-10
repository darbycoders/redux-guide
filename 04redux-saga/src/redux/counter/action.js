import { delay, put, takeEvery, takeLatest } from 'redux-saga/effects';

export const actionTypes = {
  INCREASE: 'counter/INCREASE',
  DECREASE: 'counter/DECREASE',

  INCREASE_ASYNC: 'counter/INCREASE_ASYNC',
  DECREASE_ASYNC: 'counter/DECREASE_ASYNC'
}

export const increase = () => ({ type: actionTypes.INCREASE });
export const decrease = () => ({ type: actionTypes.DECREASE });
export const increaseAsync = () => ({ type: actionTypes.INCREASE_ASYNC });
export const decreaseAsync = () => ({ type: actionTypes.DECREASE_ASYNC });

export function* increaseSaga() {
  yield delay(1000);
  yield put(increase());
}

export function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
}

export function* counterSaga() {
  yield takeEvery(actionTypes.INCREASE_ASYNC, increaseSaga);
  yield takeLatest(actionTypes.DECREASE_ASYNC, decreaseSaga);
}