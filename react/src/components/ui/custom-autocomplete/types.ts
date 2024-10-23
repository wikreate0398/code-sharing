import React from 'react'
import { array } from 'yup'
import { empty, minutesToFullTime } from '#root/src/helpers/functions'
import UserIcon from '#root/src/components/ui/svg-icons/icons/user-icon'

interface PropsWithDnd {
    draggable: boolean
    onDragEnd: (v: any) => void
}

interface PropsWithoutDnd {
    draggable?: boolean
    onDragEnd?: (v: any) => void
}

type DndProps = PropsWithDnd | PropsWithoutDnd

interface InputProps{
    title: string,
    rightTitle?: string,
    placeholder?: string,
    startAdornment: React.JSX.Element
}

interface Props {
    items: {
        id: string | number
        name: string
        avatar?: string
        color?: string
        color_selected?: string
        persistent?: boolean
    }[]
    values: string[]
    filterItems?: (arr: Props['items']) => Props['items']
    handleCreate?: (v: string, e?: React.SyntheticEvent | undefined) => void
    handleChange: (v: string[], t: string) => void
    renderInput?: (props: any) => React.JSX.Element
    renderTags?: (...props: any) => React.JSX.Element,
    renderOption?: (...props: any) => React.JSX.Element,
    optionEndAdornment?: (props: any) => React.JSX.Element
    inputProps?: InputProps // need to define intergace for input
    selectable?: boolean
    creatable?: boolean
    multiple?: boolean
    filterSelectedOptions?: boolean
    disableClearable?: boolean
    deleteOnOpen?: boolean
    defaultTags?: []
}

type AutocompleteProps = Props & DndProps

export default AutocompleteProps
