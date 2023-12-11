import { Typography } from '@mui/material'
import Wrapper from '../_components/wrapper'
import ConstantsTable from './table'

const ConstantsScreen = () => {
    return (
        <Wrapper>
            <Typography mb="30px" variant="title-32">
                Константы ру/en
            </Typography>
            <ConstantsTable />
        </Wrapper>
    )
}

export default ConstantsScreen
