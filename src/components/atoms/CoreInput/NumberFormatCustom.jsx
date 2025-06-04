import { forwardRef, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { NumericFormat } from 'react-number-format'

const NumberFormatCustom = forwardRef(function NumberFormatCustomBase(
    props,
    ref
) {
    const {
        onChange,
        disabledecimal: disableDecimal,
        disablenegative: disableNegative,
        ...other
    } = props

    const handleChange = useCallback(
        (value) => {
            if (onChange) {
                onChange({
                    target: {
                        name: props.name,
                        value: value.value,
                    },
                })
            }
        },
        [props.name, onChange]
    )

    return (
        <NumericFormat
            {...other}
            // thousandSeparator={'.'}
            // decimalSeparator={'.'}
            decimalScale={disableDecimal ? 0 : other?.decimalScale ?? undefined}
            allowNegative={!disableNegative}
            getInputRef={ref}
            onValueChange={handleChange}
        />
    )
})
NumberFormatCustom.propTypes = {
    onChange: PropTypes.func,
    disabledecimal: PropTypes.bool,
    disablenegative: PropTypes.bool,
    name: PropTypes.string,
}

export default memo(NumberFormatCustom)
