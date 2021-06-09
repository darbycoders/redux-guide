const sleep = n => new Promise(resolve => setTimeout(resolve, n));

const posts = [
  {
    id: 1,
    title: 'title01',
    body: 'content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.content01.'
  },
  {
    id: 2,
    title: 'title02',
    body: 'content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.content02.'
  },
  {
    id: 3,
    title: 'title03',
    body: 'content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.content03.'
  }
];

export const getPosts = async () => {
  await sleep(500);
  return posts;
};

export const getPostById = async id => {
  await sleep(500); 
  return posts.find(post => post.id === id);
};