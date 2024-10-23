import { forwardRef } from 'react'

const Tbody = forwardRef(({ children, ...props }, ref) => {
    return (
        <tbody {...(ref ? { ref } : {})} {...props}>
            {children}
        </tbody>
    )
})

export default Tbody
