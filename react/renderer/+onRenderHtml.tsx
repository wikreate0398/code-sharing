// https://vike.dev/onRenderHtml
import {renderToString} from "react-dom/server";

export { onRenderHtml }

import React, {Fragment} from 'react'
import {dangerouslySkipEscape, escapeInject} from 'vike/server'
import { PageShell } from './PageShell'
import type { OnRenderHtmlAsync } from 'vike/types'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
    let viewHtml = null
  if (pageContext?.Page) {
      viewHtml = dangerouslySkipEscape(renderToString(
        <PageShell pageContext={pageContext}>
          <pageContext.Page />
        </PageShell>,
    ))
  }

  const Head = pageContext?.config?.Head || Fragment

  const headHtml =  dangerouslySkipEscape(renderToString(
      <Head />
  ))

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
         ${generateMetaData(pageContext)}
         ${headHtml}
      </head>
      <body>
        <div id="root">${viewHtml}</div>
      </body>
    </html>`
}

const generateMetaData = (pageContext) => {
    const metadata = pageContext?.data?.metadata || pageContext?.exports?.metadata

    let metaTags = ``;
    if (metadata?.title) metaTags += `<title>${metadata?.title}</title>`
    metaTags += ` <meta name="description" content="${metadata?.description || '...'}" />`
    if (metadata?.keywords) metaTags += ` <meta name="keywords" content="${metadata?.keywords}" />`

    return dangerouslySkipEscape(metaTags)
}