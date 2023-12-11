export const projectsRoute = () => `/dashboard/projects`
export const projectRoute = (id_project, firstBoard) => {
    let url = `/dashboard/p/${id_project}`
    if (firstBoard) {
        url += `?firstBoard=1`
    }
    return url
}

export const participantStatisticRoute = (login = false) => {
    let path = `/dashboard/stats`
    if (login) {
        path += `/${login}`
    }
    return path
}

export const cashboxRoute = () => `/dashboard/cashbox`
export const projectParticipantRoute = (id_project, login) =>
    `/dashboard/p/${id_project}/user/${login}`
export const boardRoute = (id_project, id_board) =>
    `/dashboard/p/${id_project}/board/${id_board}`
export const taskRoute = (id_project, id_board, id_task) =>
    `/dashboard/p/${id_project}/board/${id_board}/?t=${id_task}`
export const logoutRoute = () => `/auth/logout`
