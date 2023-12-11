import SeoTask from '@/components/screens/seo/task'
import { cache } from 'react'

const getTask = cache(async (url) => {
    const task = await fetch(`${process.env.API_URL}meta/seo/t/${url}`)
    return task.json()
})

export async function generateMetadata({ params }) {
    try {
        const { name: title, comment: description } = await getTask(params.slug)
        return { title, description: description || '...' }
    } catch {
        return { title: 'Not found', description: '404 error' }
    }
}

export default async function TaskSeoPage({ params }) {
    const task = await getTask(params.slug)
    return <SeoTask task={task} slug={params.slug} />
}
