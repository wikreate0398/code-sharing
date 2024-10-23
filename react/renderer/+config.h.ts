import type { Config, ConfigEnv} from 'vike/types'
import config from '@vite-plugin-vercel/vike/config';

// https://vike.dev/config
export default {
  passToClient: ['someAsyncProps', 'pageProps', 'routeParams'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {

    metadata: {
      env: { server: true, client: true },
    },

    Head: {
      // Load the value of /pages/**/+Layout.js on both the server and client
      env: { server: true }
    },

    // default
    Page: {
      env: { client: true } // SPA for all pages
    },

    // Define new setting 'dataIsomorph'
    renderMode: {
      env: { config: true },
      effect({ configDefinedAt, configValue }) {
        let env: ConfigEnv | undefined
        if (configValue == 'HTML') env = { server: true }
        if (configValue == 'SPA') env = { client: true }
        if (configValue == 'SSR') env = { server: true, client: true }
        if (!env) throw new Error(`${configDefinedAt} should be 'SSR', 'SPA', or 'HTML'`)
        return {
          meta: {
            Page: { env }
          }
        }
      }
    }
  },
  hooksTimeout: {
    data: {
      error: 30 * 1000,
      warning: 10 * 1000
    }
  },
  extends: config,
} satisfies Config
