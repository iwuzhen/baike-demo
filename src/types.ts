import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface SearchResultModule {
  id?: number
  title?: string
  category?: [string]
  lang?: string
  abstract?: string
  redirect_from?: string
  zh_title?: string
}
