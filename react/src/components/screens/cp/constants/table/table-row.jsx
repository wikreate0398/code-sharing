import Input from '#root/src/components/ui/form/input'
import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { flexCenterProps } from '#root/src/helpers/functions'
import { useFormikContext } from 'formik'

const useStyles = makeStyles((theme) =>
    createStyles({
        divider: {
            ...flexCenterProps('center'),
            color: '#000',
            opacity: '22%',
            fontSize: '32px',
            fontWeight: 300,
            lineHeight: '16px',
            maxHeight: '44px'
        },
        input: {
            '& input:disabled': {
                '-webkit-text-fill-color': '#000'
            },
            '& input:disabled ~ fieldset': {
                background: '#9EA5B2',
                opacity: '11%'
            }
        }
    })
)

const TableRow = ({ items, className, validationSchema }) => {
    const classList = useStyles()
    const {
        handleChange,
        errors,
        values,
        setFieldError,
        setErrors,
        handleSubmit
    } = useFormikContext()

    const handleKeyDown = async (e, index) => {
        if (e.keyCode !== 13) return

        setErrors({})

        try {
            await validationSchema.validateAt(`items.${index}`, values)
            values.currentElement = index

            handleSubmit(index)
        } catch (error) {
            setFieldError(error.path, error.errors[0])
        }
    }

    return (
        <>
            {items.map((item, idx) => (
                <Box key={idx} className={className}>
                    <Input
                        className={classList.input}
                        name={`items.${idx}.name`}
                        value={item.name}
                        disabled={item.id !== null}
                        error={
                            errors.items &&
                            errors.items[idx] &&
                            errors.items[idx].name
                                ? errors.items[idx].name
                                : ''
                        }
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                    />
                    <Box className={classList.divider}>-</Box>
                    <Input
                        name={`items.${idx}.value.ru`}
                        value={item.value.ru}
                        error={
                            errors.items &&
                            errors.items[idx] &&
                            errors.items[idx]?.value?.ru
                                ? errors.items[idx].value.ru
                                : ''
                        }
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                    />
                    <Input
                        name={`items.${idx}.value.en`}
                        value={item.value.en}
                        error={
                            errors.items &&
                            errors.items[idx] &&
                            errors.items[idx]?.value?.en
                                ? errors.items[idx].value.en
                                : ''
                        }
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                    />
                </Box>
            ))}
        </>
    )
}

export default TableRow
