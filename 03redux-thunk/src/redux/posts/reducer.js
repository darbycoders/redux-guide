import { actionTypes } from './action';
import { reducerUtils, handleAsyncActions, handleAsyncActionsById } from '../../lib/asyncUtils';

const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial()
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_POSTS:
    case actionTypes.GET_POSTS_SUCCESS:
    case actionTypes.GET_POSTS_ERROR:
      return handleAsyncActions(actionTypes.GET_POSTS, 'posts', true)(state, action);
    case actionTypes.GET_POST:
    case actionTypes.GET_POST_SUCCESS:
    case actionTypes.GET_POST_ERROR:
      return handleAsyncActionsById(actionTypes.GET_POST, 'post', true)(state, action);
    case actionTypes.CLEAR_POST:
      return {
        ...state,
        post: reducerUtils.initial()
      };
    default:
      return state;
  }
}