import { TableCell, TableRow, Typography } from '@mui/material'

export const TableRowEmpty = (props) => {
    const { colSpan, isShowNoDataText } = props

    if (!isShowNoDataText) return null

    return <TableRow>
        <TableCell
            colSpan={colSpan}
            variant="body"
            align="center"
            className="py-8"
        >
            <div className="flex justify-center min-h-[60px] flex-col">
                <Typography variant="body2">
                    Không có dữ liệu
                </Typography>
            </div>
        </TableCell>
    </TableRow>
}