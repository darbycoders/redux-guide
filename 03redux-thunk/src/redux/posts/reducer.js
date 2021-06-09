import { actionTypes } from './action';
import { reducerUtils, handleAsyncActions } from '../../lib/asyncUtils';

const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial()
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_POSTS:
    case actionTypes.GET_POSTS_SUCCESS:
    case actionTypes.GET_POSTS_ERROR:
      return handleAsyncActions(actionTypes.GET_POSTS, 'posts')(state, action);
    case actionTypes.GET_POST:
    case actionTypes.GET_POST_SUCCESS:
    case actionTypes.GET_POST_ERROR:
      return handleAsyncActions(actionTypes.GET_POST, 'post')(state, action);
    default:
      return state;
  }
}