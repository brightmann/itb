import { GetServerSideProps } from 'next'

import { loadAllPostsByLocale, readPostMarkdown } from 'utils/blog'
import { BlogPost, BlogPostProps } from 'views/BlogPost'

import enCommon from '../../../public/locales/en/common.json'
import ptCommon from '../../../public/locales/pt/common.json'

const resources: Record<string, Record<string, unknown>> = {
  pt: { common: ptCommon },
  en: { common: enCommon },
}

type BlogPostPathParams = {
  slug: string
}

export const getServerSideProps: GetServerSideProps<
  BlogPostProps,
  BlogPostPathParams
> = async ({ params, locale = 'pt' }) => {
  const slug = params?.slug

  const markdown = slug && (await readPostMarkdown({ locale, slug }))

  if (!markdown) {
    return { notFound: true }
  }

  const allPosts = await loadAllPostsByLocale(locale, 'asc')
  const postIndex = allPosts.findIndex((p) => p.slug === slug)
  const [previousPost, nextPost] = [postIndex - 1, postIndex + 1].map((i) => {
    const isValidIndex = i >= 0 && i < allPosts.length

    return isValidIndex ? allPosts[i] : null
  })

  const { html, data } = markdown

  return {
    props: {
      source: { html },
      frontMatter: data,
      links: {
        next: nextPost && {
          slug: nextPost.slug,
          title: nextPost.post.data.title as string,
        },
        previous: previousPost && {
          slug: previousPost.slug,
          title: previousPost.post.data.title as string,
        },
      },
      _nextI18Next: {
        initialI18nStore: {
          [locale]: resources[locale] || resources.pt,
        },
        initialLocale: locale,
        ns: ['common'],
      },
    } as unknown as BlogPostProps,
  }
}

export default BlogPost
