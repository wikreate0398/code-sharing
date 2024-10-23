import SeoTask from '#root/src/components/screens/seo/task'
import {useData, useParams} from "#root/renderer/hooks";

export default function Page() {
    const data = useData()
    const ctx = useParams()

    return <SeoTask task={data.task} slug={ctx.slug} />
}
