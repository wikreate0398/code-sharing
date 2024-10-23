// https://vike.dev/pageContext#typescript
import {MetaDataProps} from "#root/src/types";

declare global {
  namespace Vike {
    interface PageContext {
      Page: ReactElement,
      Layout: ReactElement,
      Head?: ReactElement,
      data?: {
        metadata?: MetaDataProps
      }
      exports?: {
        metadata?: MetaDataProps,
      }
      abortReason?: string
      someAsyncProps?: number
    }
  }
}

type ReactElement = () => React.ReactElement

// Tell TypeScript that this file isn't an ambient module
export {}
