'use client'

import createCache from '@emotion/cache'
import moment, { now } from 'moment'
import 'moment-timezone'

export const objKeys = (values) => {
    return Object.keys(values)
}

export const uploadPath = (src) => {
    return `${trimRight(process.env.STORAGE_LINK, '/')}/uploads/${trimLeft(
        src,
        '/'
    )}`
}

export const objValues = (values) => {
    return Object.values(values)
}

export function trimLeft(str, charlist) {
    if (charlist === undefined) charlist = '/\\/$/'

    return str.replace(new RegExp('^[' + charlist + ']+'), '')
}

export function trimRight(str, charlist) {
    if (charlist === undefined) charlist = '/\\/$/'

    return str.replace(new RegExp('[' + charlist + ']+$'), '')
}

export function trimPath(str, charlist) {
    return trimRight(trimLeft(str, charlist), charlist)
}

export const inArray = (index, arr) => {
    if (index === null || arr === undefined) {
        return false
    }

    return (
        Object.entries(arr).filter((v) => {
            return index === v[1]
        }).length > 0
    )
}

export const apiUrl = (url) => {
    return `/${trimPath(url)}`
}

export const getLocalStorage = (key) => {
    return localStorage.getItem(key)
}

export const updateJsonToLocalStorage = (key, obj) => {
    const currentValues = getLocalStorage(key)
    localStorage.setItem(key, JSON.stringify({ ...currentValues, ...obj }))
}

export const saveInLocalStorage = (key, value) => {
    localStorage.setItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value
    )
}

export const removeLocalStorageKey = (key) => {
    localStorage.removeItem(key)
}

export const clearLocalStorage = () => {
    objKeys(localStorage).forEach((key) => {
        removeLocalStorageKey(key)
    })
}

export default function createEmotionCache() {
    return createCache({ key: 'css', prepend: true })
}

export const spaceBetweenProps = () => {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}

export const endJustifyContent = () => {
    return {
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center'
    }
}

export const flexStartProps = (align = false) => {
    return {
        display: 'flex',
        justifyContent: 'flex-start',
        ...(align ? { alignItems: align } : {})
    }
}

export const flexEndProps = (align = false) => {
    return {
        display: 'flex',
        justifyContent: 'flex-end',
        ...(align ? { alignItems: align } : {})
    }
}

export const flexCenterProps = (align = false) => {
    return {
        display: 'flex',
        justifyContent: 'center',
        ...(align ? { alignItems: align } : {})
    }
}

export const formLabel = () => {
    return {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '16px',
        color: '#000 !important'
    }
}

export const isFnc = (fnc) => {
    return typeof fnc === 'function'
}

export const isNull = (data) => {
    return data === null
}

export const empty = (data) => {
    if (data === null || data === undefined) return true

    if (typeof data != 'object') {
        data = {}
    }

    return !Object.keys(data).length > 0
}

export const pluck = (array, key) => {
    const newArr = []
    Object.values(array).forEach((value) => {
        if (key in value) {
            newArr.push(value[key])
        }
    })

    return newArr.filter((v, i, a) => a.indexOf(v) === i)
}

export const keyBy = (array, key) => {
    const newArr = []
    Object.values(array).forEach((value) => {
        newArr[value[key]] = value
    })

    return newArr
}

export const declination = (count, f1, f2, f3) => {
    count = count % 100
    const lcount = count % 10
    if (count >= 11 && count <= 19) return f3
    if (lcount >= 2 && lcount <= 4) return f2
    if (lcount === 1) return f1
    return f3
}

export const whereFields = (where, data) => {
    let found = 0
    Object.entries(where).forEach((v, k) => {
        let keyName = v[0]
        let val = v[1]

        if (data?.[keyName] == val) {
            found++
        }
    })

    return found === objKeys(where).length
}

const arr = [
    { id: 1, name: 'iarik' },
    { id: 2, name: 'danik' },
    { id: 3, name: 'sasha' },
    { id: 4, name: 'costea' }
]

export const updateArray = (array, { where, update, qtyDelete = true }) => {
    const editedData = []
    objValues(array).forEach((value) => {
        let newItem = { ...value }

        if (!empty(newItem)) {
            const row = whereFields(where, newItem) ? update : {}
            editedData.push({ ...newItem, ...row })
        }
    })
    return editedData
}

export const sortBy = (arr, key) => {
    const sortedItems = objValues(arr).sort(function (a, b) {
        if (a[key] > b[key]) {
            return 1
        }

        if (a[key] < b[key]) {
            return -1
        }

        return 0
    })

    return objValues(sortedItems)
}

export const resetPosition = (arr) => {
    return arr.map((value, index) => ({
        ...value,
        position: index + 1
    }))
}

export const isClient = () => typeof window !== 'undefined'

export const confirmAlert = (msg = null) => {
    return window.confirm(msg || 'Подтвердить операцию')
}

export const handleEnqueueSnackbar = (
    enqueueSnackbar,
    message,
    status = 'success',
    options = {}
) => {
    if (message === undefined || !message || message === '') return

    let variant = status
    if (typeof status === 'boolean') {
        variant = status ? 'success' : 'error'
    }
    Object.assign(options, {
        variant: variant,
        autoHideDuration: 3000
    })
    enqueueSnackbar(message, options)
}

export const timeDigit = (val) => {
    if (!val) {
        return '00'
    } else if (val < 10) {
        return `0${val}`
    }

    return val
}

export const wrapURLs = function (text, new_window = true) {
    const url_pattern = /(https?):\/\/[^\s/$.?#].[^\s]*/g
    const target = new_window === true || new_window == null ? '_blank' : ''

    return text.replace(url_pattern, function (url) {
        const protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i
        const href = protocol_pattern.test(url) ? url : 'http://' + url
        return '<a href="' + href + '" target="' + target + '">' + url + '</a>'
    })
}

export const momentAdd = (value, unit, format = 'YYYY-MM-DD') => {
    return moment().add(value, unit).format(format)
}

export const dateFormat = (date = null, f = 'YYYY-MM-DD') => {
    const momentDate = moment(date || new Date())
    return momentDate.isValid()
        ? momentDate.format(f)
        : moment(new Date(date || moment())).format(f)
}

export const getClickedTagName = (event) => event.target.tagName.toLowerCase()

export const roundSecToHours = (sec) => {
    if (!sec) return 0
    const totalMinutes = Math.floor(parseInt(sec) / 60)
    return Math.floor(totalMinutes / 60)
}

export const roundSecToMin = (sec) => {
    if (!sec) return 0
    return Math.floor(parseInt(sec) / 60)
}

export const minToHours = (min) => {
    const hours = Math.floor(min / 60)
    const minutes = min - hours * 60
    return { hours, minutes }
}

export const minToAnalyticFormat = (min) => {
    const time = minToHours(min)
    const value = []
    const symbol = []

    if (time.hours) {
        value.push(time.hours)
        symbol.push('h')
    }

    if (time.minutes) {
        value.push(time.minutes)
        symbol.push('m')
    }

    return { value, symbol }
}

export const priceString = (price, decimals = 2) => {
    if (!price) {
        return 0
    }

    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: decimals })
        .format(price)
        .replace(',', '.')
}

export const countHourlyPrice = (minutes, price) => {
    const total = (minutes / 60) * price
    return Math.ceil(total / 0.5) * 0.5
}

export const preventEventByLinkClick = (e, fnc, tagName = 'a') => {
    if (getClickedTagName(e) !== tagName) fnc()
}

export const monthName = (nr, declination = false) => {
    const names = {
        1: ['Январь', 'Января'],
        2: ['Февраль', 'Февраля'],
        3: ['Март', 'Марта'],
        4: ['Апрель', 'Апреля'],
        5: ['Май', 'Мая'],
        6: ['Июнь', 'Июня'],
        7: ['Июль', 'Июля'],
        8: ['Август', 'Авгуса'],
        9: ['Сентябрь', 'Сентября'],
        10: ['Октябрь', 'Октября'],
        11: ['Ноябрь', 'Ноября'],
        12: ['Декабрь', 'Декабря']
    }

    return names[nr.toString()][declination ? 1 : 0]
}

export const isLocal = () => {
    return process.env.APP_ENV === 'local'
}

export const isProd = () => {
    return process.env.APP_ENV === 'production'
}

export const diffTime = (time, unitOfTime = 'minutes') => {
    return parseInt(moment().diff(time, unitOfTime))
}

export const diffBetween = (from, to, unitOfTime = 'minutes') => {
    return (
        Math.abs(
            parseInt(
                moment(to, 'YYYY-MM-DD').diff(
                    moment(from, 'YYYY-MM-DD'),
                    unitOfTime
                )
            )
        ) + 1
    )
}

export const timeAgo = (time) => {
    const minuntes = diffTime(time)

    if (minuntes === 0) {
        return `Только что`
    } else if (minuntes < 60) {
        return `${minuntes} ${declination(
            minuntes,
            'минута',
            'минуты',
            'минут'
        )} назад`
    } else if (minuntes < 60 * 24) {
        const hours = diffTime(time, 'hours')
        return `${hours} ${declination(hours, 'час', 'часа', 'часов')} назад`
    } else if (diffTime(time, 'days') === 1) {
        return `Вчера в ${dateFormat(time, 'HH.mm')}`
    } else if (minuntes < 60 * 24 * 7) {
        const days = diffTime(time, 'days')
        return `${days} ${declination(days, 'день', 'дня', 'дней')} назад`
    }

    return dateFormat(time, 'DD.MM.YY')
}

const isObject = (object) => {
    return object != null && typeof object === 'object'
}

export const toOriginalTimezone = (time = null) => {
    const moscow = moment.tz(time ?? now(), moment.tz.guess())
    const toCurrentTimezone = moscow.clone().tz('Europe/Moscow')
    return moment(toCurrentTimezone.format())
}

export const toLocalTimezone = (time = null) => {
    const moscow = moment.tz(time ?? now(), 'Europe/Moscow')
    const toCurrentTimezone = moscow.clone().tz(moment.tz.guess())
    return moment(toCurrentTimezone.format())
}

export const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

export const objectToQueryStr = (obj) => {
    const queryObj = {}
    Object.keys(obj).map((v) => {
        if (obj[v]) queryObj[v] = obj[v]
    })
    return new URLSearchParams(queryObj).toString()
}

export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            resolve(reader.result)
        }

        reader.onerror = (err) => {
            reject(err)
        }
    })
}

export const isBase64 = (string) => {
    return /^data:image\/\w+;base64,/.test(string)
}

export const getLastSymbolPosition = (inputRef) => {
    if (!inputRef) return [0, 0]

    const input = inputRef.current
    const position = input.selectionEnd
    const textBeforeCursor = input.value.substring(0, position)
    const lines = textBeforeCursor.split('\n')
    const lineCount = lines.length
    const column = lines[lineCount - 1].length
    const x = column + 1
    const y = lineCount + 1

    return [x, y]
}

export const wrapLogins = function (text, users = []) {
    if (users.length <= 0) {
        return text
    }

    users.map((user) => {
        text = text.replaceAll(`@${user.login}`, `<a>@${user.login}</a>`)
    })

    return text
}

export const updateElementById = (arr, id, newData) => {
    const index = arr.findIndex((item) => item.id === id)

    if (index !== -1) {
        arr[index] = { ...arr[index], ...newData }
    }

    return arr
}

export const match = (str, query) => {
    return str.match(new RegExp(query, 'i'))
}

export const searchData = (array, query, key = 'name') => {
    if (query.length <= 0) return array

    return array.filter((v) => match(v[key], query))
}
