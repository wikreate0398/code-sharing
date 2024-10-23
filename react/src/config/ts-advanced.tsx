import { FC, ReactNode } from 'react'

export type ReadOnlyProps<T> = {
    readonly [P in keyof T]: T[P]
}

export type Nullable<T> = {
    [P in keyof T]: T[P] | null
}

export type OneOf<T> = {
    [P in keyof T]?: T[P]
}

export interface WithChildrenProp {
    children?: ReactNode
}

export type PropsWithChildren<P> = P & WithChildrenProp

// interface Props {
//     title: string
//     name: string
// }
//
// type ReadOnlyComponentsProps = ReadOnlyProps<Props>

interface Person {
    type: 'person'
    name: string
    age: number
}

interface Company {
    type: 'company'
    name: string
    numberOfEmployee: number
}

type Entity = Person | Company

const isPerson = (entity: Entity): entity is Person => {
    return entity.type === 'person'
}

const Render: FC<{ entity: Entity }> = ({ entity }) => {
    if (isPerson(entity)) {
        return <div> age: {entity.age} </div>
    }
    return <div> age: {entity.numberOfEmployee} </div>
}

type Test =
    | { tab: 'a'; b: number; c: string }
    | { tab: 'b'; b: string; c: object }
