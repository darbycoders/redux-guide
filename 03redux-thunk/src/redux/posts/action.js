import * as postsAPI from '../../api/posts'; // api/posts 안의 함수 모두 불러오기
import { createPromiseThunk } from '../../lib/asyncUtils';

export const actionTypes = {
  GET_POSTS: 'posts/GET_POSTS',
  GET_POSTS_SUCCESS:'posts/GET_POSTS_SUCCESS',
  GET_POSTS_ERROR: 'posts/GET_POSTS_ERROR',

  GET_POST: 'posts/GET_POST',
  GET_POST_SUCCESS:'posts/GET_POST_SUCCESS',
  GET_POST_ERROR: 'posts/GET_POST_ERROR',
}

export const getPosts = createPromiseThunk(actionTypes.GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(actionTypes.GET_POST, postsAPI.getPostById);