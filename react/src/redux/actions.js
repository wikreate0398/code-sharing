import { metaActions } from '#root/src/redux/slices/meta.slice'
import { activityActions } from '#root/src/redux/slices/activity.slice'

const actions = {
    ...metaActions,
    ...activityActions
}

export default actions
