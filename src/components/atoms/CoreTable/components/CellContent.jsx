import _ from 'lodash'
import { useDate } from '../../../../hooks/date/useDate'
import { Typography } from '@mui/material'



export const CellContent = ({ render, row, fieldName }) => {
    const { checkDateValid, convertToDate } = useDate()

    if (row && render) {
        return render(row)
    }

    if (row && fieldName) {
        const val = _.get(row, fieldName)

        if (_.isNumber(val)) return <Typography>{new Intl.NumberFormat('en-US').format(val)}</Typography>

        if (checkDateValid(val)) return convertToDate(val)

        return val
    }

    return null
}
