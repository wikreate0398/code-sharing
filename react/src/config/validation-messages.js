import { declination } from '#root/src/helpers/functions'

export const requiredMessage = 'Обязательное поле'
export const numbericValidation = 'Значение должно быть больше 0'

export const emailValidation = 'Укажите верный e-mail'
export const passLengthMin = 'Пароль должен содержать не менее 6 символов'
export const passLengthMax = 'Пароль не может быть длиннее 24 символов'
export const passNotMatch = 'Пароль не совпадает'
export const loginValidation =
    'Разрешено: (a-z) (0-9) (_), _ не может быть в начале'
export const passMustntMatchLogin = 'Пароль не может совпадать с логином'

export const minimumSymbols = (count) =>
    `Минимум ${count} ${declination(count, 'символ', 'символа', 'символов')}`
export const maxSymbolsValidation = (count) =>
    `Максимально ${count} ${declination(
        count,
        'символ',
        'символа',
        'символов'
    )}`
export const maximumFileSize = (size) =>
    `Размер файла не должен превышать ${size}Мб.`
export const mustContainDigitLetter = (field) =>
    `${field} должен содержать хотя бы одну заглавную и строчную букву и одну цифру`
