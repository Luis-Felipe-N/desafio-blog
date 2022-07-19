import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import { AiOutlineUser,AiOutlineCalendar } from 'react-icons/ai'
import style from '../styles/home.module.scss';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home({posts}) {
  console.log(posts)
  return (
    <main className={style.home}>
      <div className={style.containerPosts}>
        {posts.map(post => (
          <Link href={`/post/${post.uid}`}>
            <a>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <time>
              <AiOutlineCalendar />
              {post.first_publication_date}
            </time>
            <span>
              <AiOutlineUser />
              {post.data.author}
            </span>
            </a>
          </Link>
        ))}
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getAllByType('posts');
  
  const posts = postsResponse.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: post.data.subtitle ? RichText.asText(post.data.subtitle) : '',
        author: RichText.asText(post.data.autor)
      }
    }
  })

  return {
    props: {
      posts: posts
    }
  }
};
