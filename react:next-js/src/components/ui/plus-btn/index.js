import Icon from '@/components/ui/icon'
import { Button } from '@mui/material'

const PlusBtn = (props) => {
    return (
        <Button variant="gray-sm" {...props}>
            <Icon pointer name="plus" v2 />
        </Button>
    )
}

export default PlusBtn
