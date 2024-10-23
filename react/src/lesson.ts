type UserType = {
    id: Number
    name: String
}

type LocationType = {
    address: String
    city: String
}

const user: UserType = {
    id: 1,
    name: 'Danik'
}

const loc: LocationType = {
    address: 'Ialoveni',
    city: 'Chisinau'
}

const numbers: string[] = ['cat', 'dog', 'horse']

const numbers2: Array<UserType> = [user, { id: 1, name: 'Danik' }]

const readOnlyNumbers: ReadonlyArray<Number> = [1, 2, 3]

let data: UserType & LocationType

data = { ...loc, ...user }

// КОРТЕЖИ

type TypeArray = [number, string, null]

const cortage: TypeArray = [1, '2', null]
