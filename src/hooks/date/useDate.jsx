import moment from 'moment'

export const FORMAT_DATE_API = 'YYYY-MM-DD'
export const DEFAULT_FORMAT_DATE = 'DD/MM/YYYY'

export const useDate = () => {

    const convertToDate = (val) => {
        if (!val) return null
        else return moment(val).format(DEFAULT_FORMAT_DATE)
    }


    const compareTimes = (time1, time2) => {
        const date1 = new Date(time1)
        const date2 = new Date(time2)

        if (date1.getTime() > date2.getTime()) {
            return 1
        } else if (date1.getTime() < date2.getTime()) {
            return -1
        } else {
            return 0
        }
    }

    const getDateNow = () => {
        return moment(moment.now()).format(FORMAT_DATE_API)
    }

    const getStartDateOfMonth = () => {
        return moment(moment().startOf('month')).format(FORMAT_DATE_API)
    }

    const getEndDateOfMonth = () => {
        return moment(moment().endOf('month')).format(FORMAT_DATE_API)
    }

    const checkDateValid = (val) => {
        return (
            moment(val, 'DD-MM-YYYY', true).isValid() ||
            moment(val, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid() ||
            moment(val, 'YYYY-MM-DD', true).isValid()
        )
    }

    return {
        convertToDate,
        getDateNow,
        compareTimes,
        getStartDateOfMonth,
        getEndDateOfMonth,
        checkDateValid,
    }
}
