import { metaActions } from '@/redux/slices/meta.slice'
import { activityActions } from '@/redux/slices/activity.slice'

const actions = {
    ...metaActions,
    ...activityActions
}

export default actions
