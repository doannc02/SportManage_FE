import { TableCell, TableRow } from '@mui/material'
import PropTypes from 'prop-types'
import { Skeleton } from '@chakra-ui/react'

export const TableRowLoading = ({ colSpan }) => {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} variant="body">
                <Skeleton height={{base:"50px", md:"80px"}} />
            </TableCell>
        </TableRow>)
}

TableRowLoading.propTypes = {
    colSpan: PropTypes.number.isRequired,
}
