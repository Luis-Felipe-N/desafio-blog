import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import style from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  console.log(post)
  return (
    <main className={style.post}>
      <section className={style.post__hero}>
        <Image
          src={post.data.banner.url}
          width={1400}
          layout="responsive"
          objectFit='cover'
          height={400}
        />
      </section>
      <section className={style.post__headline}>
        <h1>{post.data.title}</h1>
        <div>
          <time>{post.first_publication_date}</time>
          <span>{post.data.author}</span>
          <span>4 min</span>
        </div>
      </section>
      <section className={style.post__content}>
        {post.data.content.map(content => (
          <div key={content.heading}>
            <h2>{content.heading}</h2>
            <div dangerouslySetInnerHTML={{__html: content.body.text}}></div>
          </div>
        ))}
      </section>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getAllByType('posts');
  console.log(posts.map(post => ({params: {slug: post.uid}})))
  
  return {
    paths: posts.map(post => ({params: {slug: post.uid}})),
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async ({params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug));

  const post: Post = {
    first_publication_date: new Date(response.first_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    data: {
      author: RichText.asText(response.data.autor),
      banner: {
        url: response.data.banner.url
      },
      content: response.data.content.map(content => {
        return {
          heading: RichText.asText(content.heading),
          body: {
            text: RichText.asHtml(content.body)
          }
        }
      }),
      title: RichText.asText(response.data.title)
    }
  }

  return {
    props: {
      post
    }
  }
};
