import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import { AiOutlineUser,AiOutlineCalendar } from 'react-icons/ai'
import style from '../styles/home.module.scss';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { useState } from 'react';

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
export default function Home({postsPagination}: HomeProps) {
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  const [results, setResults] = useState(postsPagination.results)

  async function handleLoadMorePosts(next_page: string) {
    try {
      setLoading(true)
      const results = await fetch(next_page)
      const newResults = await results.json()
      console.log(newResults)
      const posts = newResults.results.map(post => {
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
      setNextPage(newResults.next_page)
      setResults(currentResults => [...currentResults, ...posts])
      setLoading(false)
    } catch (error) {
      // Mostrar mensagem de erro
    }
  }

  return (
    <main className={style.home}>
      <div className={style.containerPosts}>
        {
        results &&
        results.map(post => (
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
      {nextPage && (
        <button
        onClick={( ) => handleLoadMorePosts(nextPage)}
      >
        {loading ? (
         <span> Carregando...</span>
        ): (
          <span>Carregar mais posts</span>
        )}
      </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({previewData}) => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });
  
  const posts = postsResponse.results.map(post => {
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

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts
  }

  return {
    props: {
      postsPagination
    }
  }
};
