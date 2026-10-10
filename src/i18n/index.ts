import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

import enCommon from '../../public/locales/en/common.json'
import ptCommon from '../../public/locales/pt/common.json'

const resources: Record<string, Record<string, unknown>> = {
  pt: { common: ptCommon },
  en: { common: enCommon },
}

// Drop-in replacement for next-i18next's serverSideTranslations that works
// on Cloudflare Workers: translations are bundled at build time instead of
// read from disk with fs at request time.
export function withStaticI18n<
  TProps extends { [key: string]: unknown } = { [key: string]: unknown },
  TQuery extends ParsedUrlQuery = ParsedUrlQuery,
>(
  getStaticPropsFn: GetStaticProps<TProps, TQuery>,
): GetStaticProps<TProps, TQuery> {
  return async (context) => {
    const locale = context.locale || 'pt'

    const result = await getStaticPropsFn(context)

    if (!('props' in result)) return result

    return {
      ...result,
      props: {
        ...result.props,
        _nextI18Next: {
          initialI18nStore: {
            [locale]: resources[locale] || resources.pt,
          },
          initialLocale: locale,
          ns: ['common'],
        },
      },
    }
  }
}
