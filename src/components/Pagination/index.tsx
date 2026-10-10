import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export type PaginationProps = {
  currentPage: number
  totalPages: number
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const { locale } = useRouter()

  if (totalPages <= 1) return null

  const pageHref = (page: number) => (page === 1 ? '/' : `/page/${page}`)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Pagination"
      className="flex gap-2 justify-center items-center my-8"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          locale={locale}
          className="py-1 px-3 rounded border"
        >
          Previous
        </Link>
      ) : (
        <span className="py-1 px-3 rounded border opacity-40">Previous</span>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="py-1 px-3 font-bold rounded border"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            locale={locale}
            className="py-1 px-3 rounded border"
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          locale={locale}
          className="py-1 px-3 rounded border"
        >
          Next
        </Link>
      ) : (
        <span className="py-1 px-3 rounded border opacity-40">Next</span>
      )}
    </nav>
  )
}
