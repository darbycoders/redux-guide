import * as postsAPI from '../../api/posts'; // api/posts 안의 함수 모두 불러오기
import { createPromiseSaga, createPromiseSagaById } from '../../lib/asyncUtils';
import { takeEvery } from 'redux-saga/effects';

export const actionTypes = {
  GET_POSTS: 'posts/GET_POSTS',
  GET_POSTS_SUCCESS:'posts/GET_POSTS_SUCCESS',
  GET_POSTS_ERROR: 'posts/GET_POSTS_ERROR',

  GET_POST: 'posts/GET_POST',
  GET_POST_SUCCESS:'posts/GET_POST_SUCCESS',
  GET_POST_ERROR: 'posts/GET_POST_ERROR'
}

export const getPosts = () => ({ type: actionTypes.GET_POSTS });
export const getPost = id => ({ type: actionTypes.GET_POST, payload: id, meta: id });

const getPostsSaga = createPromiseSaga(actionTypes.GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(actionTypes.GET_POST, postsAPI.getPostById);

export function* postsSaga() {
  yield takeEvery(actionTypes.GET_POSTS, getPostsSaga);
  yield takeEvery(actionTypes.GET_POST, getPostSaga);
}