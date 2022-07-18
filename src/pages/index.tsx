import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import { AiOutlineUser,AiOutlineCalendar } from 'react-icons/ai'
import style from './home.module.scss';

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
        <div>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <time>
            <AiOutlineCalendar />
            15 Mar 2021
          </time>
          <span>
            <AiOutlineUser />
            Luis Felipe
          </span>
        </div>

        <div>
          <h1>Como utilizar Hooks</h1>
          <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App.</p>
          <time>
            <AiOutlineCalendar />
            15 Mar 2021
          </time>
          <span>
            <AiOutlineUser />
            Luis Felipe
          </span>
        </div>
        <div>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <time>
            <AiOutlineCalendar />
            15 Mar 2021
          </time>
          <span>
            <AiOutlineUser />
            Luis Felipe
          </span>
        </div>
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getAllByType('post');
  
  return {
    props: {
      posts: postsResponse
    }
  }
};
