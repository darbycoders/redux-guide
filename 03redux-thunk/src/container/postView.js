import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostView from '../components/postView';
import { getPost } from '../redux/posts/action';

export default function PostContainer({ postId }) {
  const { data, loading, error } = useSelector(
    state => state.posts.post[postId]
  ) || {
    loading: false,
    data: null,
    error: null
  };
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(postId));
  }, [postId, dispatch]);

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <PostView post={data} />;
}