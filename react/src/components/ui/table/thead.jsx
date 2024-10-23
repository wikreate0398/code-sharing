import { forwardRef } from 'react'

const Thead = forwardRef(
    ({ children, position = 'relative', top = false, ...props }, ref) => {
        const styles = {
            position,
            top
        }

        return (
            <thead style={styles} {...props} {...(ref ? { ref } : {})}>
                {children}
            </thead>
        )
    }
)

export default Thead
