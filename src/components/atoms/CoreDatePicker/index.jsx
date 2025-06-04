import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Box,
    InputGroup,
    InputRightElement,
    Icon
} from "@chakra-ui/react"
import { Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { forwardRef } from "react"
import { CalendarIcon } from "@chakra-ui/icons"

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <InputGroup>
        <Input
            onClick={onClick}
            ref={ref}
            value={value}
            readOnly
            w="100%"
            height="50px" // Tăng chiều cao của input
            color="black"
            _placeholder={{ color: "black.400" }}
            borderWidth="2px"
            _focus={{ borderColor: "black.400", borderWidth: "2px" }}
            cursor="pointer"
            paddingRight="40px" // Tạo không gian cho icon
        />
        <InputRightElement h="100%" pr="2" pointerEvents="none">
            <Icon as={CalendarIcon} color="gray.400" boxSize="20px" />
        </InputRightElement>
    </InputGroup>
))
CustomInput.displayName = "CustomInput"

const CoreDatePicker = ({ control, name, label, required }) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={required ? { required: "Trường này là bắt buộc" } : {}}
            render={({ field, fieldState }) => (
                <FormControl isInvalid={!!fieldState.error} isRequired={required} mb={2} w="100%">
                    <FormLabel>{label}</FormLabel>
                    <Box w="100%" position="relative">
                        <style>
                            {`
                            .datepicker-full-width {
                                width: 100%;
                            }
                            .datepicker-full-width > div {
                                width: 100%;
                            }
                            /* Làm cho bảng chọn thời gian rộng bằng input */
                            .react-datepicker {
                                font-size: 1rem !important;
                                width: 100% !important;
                                border: 1px solid #e2e8f0 !important;
                                border-radius: 8px !important;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
                            }
                            .react-datepicker__month-container {
                                width: 100% !important;
                            }
                            .react-datepicker__month {
                                width: 100% !important;
                                margin: 0.5rem 0 !important;
                                padding: 0 0.5rem !important;
                            }
                            .react-datepicker__week {
                                display: flex !important;
                                justify-content: space-between !important;
                                margin: 0.3rem 0 !important;
                            }
                            .react-datepicker__day {
                                display: inline-flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                                width: 2.5rem !important;
                                height: 2.5rem !important;
                                line-height: 1 !important;
                                margin: 0.2rem !important;
                                border-radius: 50% !important;
                            }
                            .react-datepicker__day:hover {
                                background-color: #edf2f7 !important;
                            }
                            .react-datepicker__day--selected {
                                background-color: #38B2AC !important;
                                color: white !important;
                            }
                            .react-datepicker__day-names {
                                display: flex !important;
                                justify-content: space-between !important;
                                padding: 0 0.5rem !important;
                                margin-bottom: 0.5rem !important;
                                border-bottom: 1px solid #e2e8f0 !important;
                            }
                            .react-datepicker__day-name {
                                display: inline-flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                                width: 2.5rem !important;
                                margin: 0.2rem !important;
                                color: #718096 !important;
                                font-weight: 600 !important;
                            }
                            .react-datepicker__header {
                                background-color: white !important;
                                border-bottom: none !important;
                                padding: 1rem 0 0.5rem 0 !important;
                                text-align: center !important;
                            }
                            .react-datepicker__current-month {
                                font-size: 1.2rem !important;
                                font-weight: 600 !important;
                                margin-bottom: 1rem !important;
                                color: #2D3748 !important;
                            }
                            .react-datepicker__navigation {
                                top: 1.5rem !important;
                            }
                            `}
                        </style>
                        <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            dateFormat="dd/MM/yyyy"
                            customInput={<CustomInput />}
                            wrapperClassName="datepicker-full-width"
                            popperModifiers={{
                                preventOverflow: {
                                    enabled: true,
                                },
                                flip: {
                                    enabled: false
                                }
                            }}
                            popperProps={{
                                strategy: "fixed"
                            }}
                            popperPlacement="bottom-end"
                        />
                    </Box>
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </FormControl>
            )}
        />
    )
}

export default CoreDatePicker