// https://vike.dev/data

export { data }
export type Data = Awaited<ReturnType<typeof data>>

import type { PageContextClient, PageContextServer } from 'vike/types'

const getTask = async (url) => {
    const task = await fetch(`${import.meta.env.VITE_API_URL}meta/seo/t/${url}`)
    return task.json()
}

async function data(pageContext: PageContextServer | PageContextClient) {

  const task = await getTask(pageContext.routeParams.slug)
  const { name: title, comment: description } = task

  return {
      task,
      metadata: {
          title,
          description
      }
  }
}
