import { loadAllPostsByLocale } from 'utils/blog'
import { enhanceStaticProps } from 'utils/next/enhanceStaticProps'
import { HomePage, HomePageProps } from 'views/HomePage'

export const POSTS_PER_PAGE = 5

export const getStaticProps = enhanceStaticProps<HomePageProps>(
  async ({ locale = 'pt' }) => {
    const posts = await loadAllPostsByLocale(locale, 'desc')
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

    return {
      props: {
        posts: posts
          .slice(0, POSTS_PER_PAGE)
          .map(({ slug, post }) => ({ slug, data: post.data })),
        currentPage: 1,
        totalPages,
      },
    }
  },
)

export default HomePage
