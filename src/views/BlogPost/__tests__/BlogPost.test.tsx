import 'utils/mocks/react-i18next'

import { screen } from '@testing-library/react'

import BlogPost, { getServerSideProps } from 'pages/blog/[slug]'
import { allSlugs, readPostMarkdown } from 'utils/blog'
import { assertPropsInResult } from 'utils/next/assertPropsInResult'
import { render } from 'utils/tests/render'

import { BlogPostProps } from '..'

const LOCALES = ['en', 'pt']

const allBlogPosts = allSlugs.flatMap((slug) =>
  LOCALES.map((locale) => ({ locale, slug })),
)

describe.each(allBlogPosts)('Post: $slug ($locale)', ({ locale, slug }) => {
  let pageProps: BlogPostProps

  beforeAll(async () => {
    const markdown = await readPostMarkdown({ locale, slug })
    if (!markdown) throw new Error(`missing post ${locale}/${slug}`)
    const result = await getServerSideProps({
      locale,
      params: { slug },
    } as never)
    assertPropsInResult(result)
    pageProps = result.props as unknown as BlogPostProps
  })

  beforeEach(async () => {
    render(<BlogPost {...pageProps} />)
  })

  it('renders without crashing', () => {
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
