import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput'
import { styled } from '@mui/system'
import { forwardRef } from 'react'

const InputNumber = forwardRef(({ endAdornment, ...props }, ref) => {
    return (
        <BaseNumberInput
            slots={{
                root: InputRoot,
                input: InputElement,
                incrementButton: () => null,
                decrementButton: () => null
            }}
            endAdornment={
                endAdornment ? (
                    <InputAdornment>{endAdornment}</InputAdornment>
                ) : null
            }
            slotProps={{
                incrementButton: {
                    children: null
                },
                decrementButton: {
                    children: null
                }
            }}
            {...props}
            ref={ref}
        />
    )
})

const InputRoot = styled('div')(
    ({ theme }) => `
  border-radius: 12px;
  color: #000;
  background: transparent;
  border: 1px solid #D6D9E0; 
  display: flex;
  padding: 4px;

  &:hover {
    border-color: #C2C4C7;
  }
 
  &:focus-visible {
    outline: 0;
    border-width: 2px;
  }
`
)

const InputElement = styled('input')(
    ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  color: #000;
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
  width: 100%
`
)

const InputAdornment = styled('div')(
    ({ theme }) => `
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center; 
`
)

export default InputNumber
