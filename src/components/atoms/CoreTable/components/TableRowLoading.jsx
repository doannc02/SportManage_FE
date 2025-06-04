import { TableCell, TableRow } from '@mui/material'
import CoreLoading from '../../CoreLoading'
import PropTypes from 'prop-types'

export const TableRowLoading = ({ colSpan }) => {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} variant="body">
                <div className="flex justify-center min-h-[60px]">
                    <CoreLoading />
                </div>
            </TableCell>
        </TableRow>)
}

TableRowLoading.propTypes = {
    colSpan: PropTypes.number.isRequired,
}
