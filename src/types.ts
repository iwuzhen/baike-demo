import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface SearchResultModule {
    _id: number
    title:string
}
