import { orderBy } from 'lodash'

import {
  allSlugs as generatedAllSlugs,
  generatedPosts,
  sortedSlugs,
} from '../../content/generated-posts'

export const allSlugs: string[] = [...generatedAllSlugs]

export type GeneratedPost = {
  mdxSource: {
    compiledSource: string
    scope?: Record<string, unknown>
    frontmatter?: Record<string, unknown>
  }
  data: Record<string, unknown>
}

const getLocalePosts = (locale: string): Record<string, GeneratedPost> => {
  const posts = (
    generatedPosts as Record<string, Record<string, GeneratedPost>>
  )[locale]
  return posts || {}
}

export const loadAllPostsByLocale = async (
  locale: string,
  sortDirection: 'asc' | 'desc',
): Promise<{ post: { data: Record<string, unknown> }; slug: string }[]> => {
  const posts = getLocalePosts(locale)
  const list = Object.entries(posts).map(([slug, p]) => ({
    post: { data: p.data },
    slug,
  }))

  return orderBy(list, ({ post }) => post.data.date, sortDirection)
}

export const getSortedSlugs = (locale: string): string[] => {
  const slugs = sortedSlugs[locale] || []
  return [...slugs]
}

type ReadPostMarkdownArgs = {
  locale: string
  slug: string
}

export const readPostMarkdown = async ({
  locale,
  slug,
}: ReadPostMarkdownArgs): Promise<GeneratedPost | null> => {
  const posts = getLocalePosts(locale)
  return posts[slug] || null
}

// Kept for compatibility; no longer points at the filesystem.
export const BLOG_FILES_FOLDER = ''
