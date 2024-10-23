
import React, { useContext } from 'react'
import type { PageContext } from 'vike/types'
import { navigate} from "vike/client/router";
import { useRollbarContext } from '@rollbar/react'

const Context = React.createContext<PageContext>(undefined as any)

export function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
    useRollbarContext(pageContext.urlPathname);

    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export function usePageContext() {
    return useContext(Context)
}

export function useData() {
    const { data } = usePageContext()
    return data
}

export const useParams = () => {
    const {routeParams} = usePageContext()
    return routeParams
}

export const usePathname = () => {
    const { urlPathname } = usePageContext()
    return urlPathname
}

export const useSearchParams = () => {
    const { urlParsed } = usePageContext()
    return new URLSearchParams(urlParsed.search)
}

export const useRouter = () => {
    return {
        push: navigate

    }
}

export const notFound = () => navigate('/404')