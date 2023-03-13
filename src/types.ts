import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface SearchResultModule {
  id?: number
  title?: string
  lang?: string
  abstract?: string
  redirect_from?: string
  zh_title?: string
  en_title?: string
  zh_redirect?: [string]
  en_redirect?: [string]
  zh_category?: [string]
  en_category?: [string]
}
