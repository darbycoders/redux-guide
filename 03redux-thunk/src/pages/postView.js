import React from 'react';
import PostViewContainer from '../container/postView';

export default function PostViewPage({ match }) {
  const { id } = match.params;

  return <PostViewContainer postId={parseInt(id, 10)} />;
}