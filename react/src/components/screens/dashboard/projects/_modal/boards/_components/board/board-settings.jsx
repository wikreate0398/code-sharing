import React from 'react'
import FormGroup from '#root/src/components/screens/dashboard/projects/_modal/_components/form-group'
import FormControl from '#root/src/components/ui/form/form-control'
import Input from '#root/src/components/ui/form/input'
import FormCheckbox from '#root/src/components/screens/dashboard/projects/_modal/_components/form-checkbox'
import useBoardSettings from '#root/src/components/screens/dashboard/projects/_modal/boards/_hooks/useBoardSettings'

const BoardSettings = () => {
    const { initialField, handleEditField } = useBoardSettings()

    const inputProps = {
        sx: {
            '& .MuiInputBase-root': {
                backgroundColor: '#fff'
            }
        }
    }

    return (
        <FormGroup label="НАСТРОЙКИ">
            <FormControl marginBottom="2px">
                <Input
                    name="name"
                    type="text"
                    label="Название доски"
                    value={initialField.name}
                    onChange={(e) => handleEditField('name', e.target.value)}
                    noBorder
                    labelInside
                    size="big"
                    {...inputProps}
                />
            </FormControl>
            <FormCheckbox
                name="private"
                value={initialField.private}
                setFieldValue={(_, val) => handleEditField('private', val)}
                options={[
                    {
                        label: 'Открытая',
                        value: false
                    },
                    {
                        label: 'Закрытая',
                        value: true
                    }
                ]}
            />
        </FormGroup>
    )
}

export default BoardSettings
