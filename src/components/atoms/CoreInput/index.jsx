import { FormHelperText, TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import NumberFormatCustom from './NumberFormatCustom';
import PropTypes from 'prop-types';




const CoreInput = (props) => {
  const {
    className,
    control,
    name,
    label,
    placeholder,
    InputLabelProps,
    inputProps,
    InputProps,
    required,
    readOnly,
    type,
    actionType,
    multiline,
    minRows = 5,
    helperText,
    disabled,
    rules,
    variant = 'outlined',
    onBlur: onBlurAction,
    disableDecimal,
    disableNegative,
    onAfterChangeValue,
    decimalScale,
    isHasMessageError = true,
    isViewProp,
    onChangeValue,
    ...restProps
  } = props;

  const isView = isViewProp ?? actionType === 'VIEW';

  let transform = null;
  if (type === 'number') {
    transform = {
      input: (value) => value,
      output: (e) => {
        const output = e.target.value;
        if (output === 0) return 0;
        if (output === '' || output === null || output === undefined) return null;
        return Number.isNaN(output) ? null : Number(output);
      },
    };
  }

  return (
    <div className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
          <>
            <TextField
              fullWidth
              type={type === 'number' ? 'text' : type}
              label={label}
              placeholder={
                !isView
                  ? placeholder ||
                  label : String(label)?.toLowerCase()
              }
              variant={variant}
              onChange={(e) => {
                onChange(transform ? transform.output(e) : e);
                if (onChangeValue) onChangeValue(e.target.value);
                if (onAfterChangeValue) onAfterChangeValue();
              }}
              onBlur={(e) => {
                onBlur();
                if (onBlurAction) onBlurAction(e);
              }}
              value={transform ? transform.input(value) : value}
              inputRef={ref}
              multiline={multiline}
              minRows={minRows}
              disabled={disabled}
              error={!!error}
              helperText={error && isHasMessageError && error.message}
              InputLabelProps={{
                shrink: placeholder ? true : undefined,
                required,
                ...InputLabelProps,
              }}
              inputProps={{
                readOnly: isView || readOnly,
                disabledecimal: disableDecimal,
                disablenegative: disableNegative,
                decimalscale: decimalScale,
                ...inputProps,
              }}
              InputProps={{
                disableUnderline: isView,
                ...InputProps,
                ...(type === 'number' && {
                  inputComponent: NumberFormatCustom,
                }),
              }}
              {...restProps}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </>
        )}
        rules={!isView ? rules : {}}
      />
    </div>
  );
};
CoreInput.propTypes = {
  className: PropTypes.string,
  control: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  placeholder: PropTypes.string,
  InputLabelProps: PropTypes.object,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  minRows: PropTypes.number,
  hidden: PropTypes.bool,
  helperText: PropTypes.any,
  disabled: PropTypes.bool,
  rules: PropTypes.any,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  onBlur: PropTypes.func,
  disableDecimal: PropTypes.bool,
  disableNegative: PropTypes.bool,
  onAfterChangeValue: PropTypes.func,
  decimalScale: PropTypes.number,
  isHasMessageError: PropTypes.bool,
  isViewProp: PropTypes.bool,
  onChangeValue: PropTypes.func,
  actionType: PropTypes.string,
};
export default React.memo(CoreInput);
