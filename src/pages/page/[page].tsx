import { GetStaticPaths } from 'next'

import { loadAllPostsByLocale } from 'utils/blog'
import { enhanceStaticProps } from 'utils/next/enhanceStaticProps'
import { HomePage, HomePageProps } from 'views/HomePage'

export const POSTS_PER_PAGE = 5

type PageParams = {
  page: string
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const { getSortedSlugs } = await import('utils/blog')
  const locales = ['pt', 'en']

  const paths = locales.flatMap((locale) => {
    const totalPages = Math.ceil(getSortedSlugs(locale).length / POSTS_PER_PAGE)
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
      params: { page: String(i + 2) },
      locale,
    }))
  })

  return { paths, fallback: false }
}

export const getStaticProps = enhanceStaticProps<HomePageProps, PageParams>(
  async ({ params, locale = 'pt' }) => {
    const page = parseInt(params?.page || '1', 10)
    const posts = await loadAllPostsByLocale(locale, 'desc')
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

    if (page < 2 || page > totalPages) {
      return { notFound: true }
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
      },
    }
  },
)

export default HomePage
