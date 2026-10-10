import { GetServerSideProps } from 'next'

import { loadAllPostsByLocale } from 'utils/blog'
import { HomePage, HomePageProps } from 'views/HomePage'

import enCommon from '../../../public/locales/en/common.json'
import ptCommon from '../../../public/locales/pt/common.json'

const resources: Record<string, Record<string, unknown>> = {
  pt: { common: ptCommon },
  en: { common: enCommon },
}

export const POSTS_PER_PAGE = 5

type PageParams = {
  page: string
}

export const getServerSideProps: GetServerSideProps<
  HomePageProps,
  PageParams
> = async ({ params, locale = 'pt' }) => {
  const page = parseInt(params?.page || '1', 10)
  const posts = await loadAllPostsByLocale(locale, 'desc')
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (!Number.isFinite(page) || page < 1 || page > totalPages) {
    return { notFound: true }
  }

  if (page === 1) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  const pagePosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  )

  return {
    props: {
      posts: pagePosts.map(({ slug, post }) => ({ slug, data: post.data })),
      currentPage: page,
      totalPages,
      _nextI18Next: {
        initialI18nStore: {
          [locale]: resources[locale] || resources.pt,
        },
        initialLocale: locale,
        ns: ['common'],
      },
    } as unknown as HomePageProps,
  }
}

export default HomePage
