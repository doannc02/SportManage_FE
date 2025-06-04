import React, { useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { find, get, isObject, map } from "lodash";
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Text,
    Tag,
    TagLabel,
    TagCloseButton,
    Spinner,
    List,
    ListItem,
    Portal,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const CoreSelectCustom = ({
    className,
    control,
    name,
    options = [],
    label,
    placeholder,
    inputProps,
    inputContainerProps,
    required,
    readOnly,
    valuePath = "value",
    labelPath = "label",
    labelPath2,
    loading,
    isHasMessageError = true,
    returnValueType = "enum",
    multiple,
    disabled,
    helperText,
    isCreateAble,
    rules,
    defaultValue,
    errCustom,
    variant = "outline",
    isViewProp,
    onChangeValue,
    onAfterChangeValue,
    renderOption,
}) => {
    const isView = isViewProp;
    const inputGroupRef = useRef(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [isFocused, setIsFocused] = useState(false);

    // Update dropdown position whenever necessary
    const updateDropdownPosition = useCallback(() => {
        if (!inputGroupRef.current || !isOpen) return;

        const inputRect = inputGroupRef.current.getBoundingClientRect();

        // Get window dimensions
        const windowHeight = window.innerHeight;

        // Calculate space below input
        const spaceBelow = windowHeight - inputRect.bottom;

        // Determine if dropdown should appear below or above the input
        const showBelow = spaceBelow >= Math.min(200, options.length * 36); // 36px per option, max 200px

        setDropdownPosition({
            width: inputRect.width,
            left: inputRect.left,
            // If showing below, position below input; if showing above, position above input
            top: showBelow ? inputRect.bottom : inputRect.top - Math.min(200, options.length * 36),
            maxHeight: Math.min(200, showBelow ? spaceBelow - 10 : inputRect.top - 10),
            showBelow,
        });
    }, [isOpen, options.length]);

    // Update dropdown position when window is resized or scrolled
    useEffect(() => {
        if (!isOpen) return;

        const handlePositionUpdate = () => {
            if (isOpen) {
                updateDropdownPosition();
            }
        };

        // Initial position update
        updateDropdownPosition();

        // Add event listeners
        window.addEventListener('resize', handlePositionUpdate);
        window.addEventListener('scroll', handlePositionUpdate, true);

        // Set up mutation observer to detect DOM changes that might affect positioning
        const observer = new MutationObserver(handlePositionUpdate);
        if (inputGroupRef.current) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }

        return () => {
            window.removeEventListener('resize', handlePositionUpdate);
            window.removeEventListener('scroll', handlePositionUpdate, true);
            observer.disconnect();
        };
    }, [isOpen, updateDropdownPosition]);

    // Update position when dropdown opens
    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
            // Small delay to ensure DOM has updated
            requestAnimationFrame(updateDropdownPosition);
        }
    }, [isOpen, updateDropdownPosition]);

    const getValueOption = useCallback(
        (value) => {
            if (multiple) {
                if (isCreateAble) return value;
                return map(value, (v) =>
                    !isObject(v)
                        ? find(options, (item) => get(item, valuePath) === v) ?? null
                        : v
                );
            }
            return returnValueType === "enum"
                ? find(options, (item) => get(item, valuePath) === value) ?? null
                : value;
        },
        [isCreateAble, multiple, options, returnValueType, valuePath]
    );

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    // Format selected values for display in input (for single select mode)
    const formatSelectedValues = (selectedValues) => {
        if (!selectedValues || (Array.isArray(selectedValues) && selectedValues.length === 0)) {
            return "";
        }

        if (multiple) {
            return ""; // For multiple selection, we'll display tags instead
        }

        return get(selectedValues, labelPath) || "";
    };

    // Focus on the input when clicking the custom input area
    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                isOpen &&
                inputGroupRef.current &&
                !inputGroupRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    // Check if an option is selected
    const isOptionSelected = (option, selectedValue) => {
        if (!selectedValue) return false;

        if (multiple) {
            return selectedValue.some(item =>
                get(item, valuePath) === get(option, valuePath)
            );
        } else {
            return get(selectedValue, valuePath) === get(option, valuePath);
        }
    };

    return (
        <Box className={className}>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                rules={!isView ? rules : {}}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
                    const selectedValue = getValueOption(value) ?? (multiple ? [] : null);
                    const filteredOptions = inputValue
                        ? options.filter((opt) =>
                            get(opt, labelPath).toLowerCase().includes(inputValue.toLowerCase())
                        )
                        : options;

                    const handleSelect = (option) => {
                        const optionValue = get(option, valuePath);
                        let newValue;

                        if (multiple) {
                            const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
                            const exists = currentValues.some((item) => get(item, valuePath) === optionValue);
                            newValue = exists
                                ? currentValues.filter((item) => get(item, valuePath) !== optionValue)
                                : [...currentValues, option];
                        } else {
                            newValue = option;
                            setIsOpen(false);
                            setIsFocused(false);
                        }

                        setInputValue(""); // Clear input after select

                        const result =
                            returnValueType === "enum"
                                ? multiple
                                    ? newValue.map((v) => get(v, valuePath))
                                    : get(newValue, valuePath) ?? null
                                : newValue;

                        onChange(result);
                        onChangeValue?.(result);
                        onAfterChangeValue?.();
                    };

                    const removeTag = (index, e) => {
                        e.stopPropagation();

                        const newSelected = [...selectedValue];
                        newSelected.splice(index, 1);

                        const result =
                            returnValueType === "enum"
                                ? newSelected.map((v) => get(v, valuePath))
                                : newSelected;

                        onChange(result);
                        onChangeValue?.(result);
                        onAfterChangeValue?.();
                    };

                    return (
                        <FormControl
                            isInvalid={!!(error || errCustom)}
                            isDisabled={disabled}
                            isReadOnly={isView || readOnly}
                        >
                            {label && (
                                <Box position="relative" {...inputContainerProps}>
                                    <FormLabel
                                        htmlFor={name}
                                        position="absolute"
                                        top="-10px"
                                        left="10px"
                                        bg="gray.100"
                                        px="2"
                                        fontSize="sm"
                                        zIndex={1}
                                        color={isFocused ? "blue.500" : "gray"}
                                        pointerEvents="none"
                                        transition="all 0.2s"
                                    >
                                        {label}{required && <Text as="span" color="red.500">*</Text>}
                                    </FormLabel>
                                </Box>
                            )}

                            <Box position="relative" {...inputContainerProps}>
                                <Box
                                    ref={inputGroupRef}
                                    onClick={focusInput}
                                    position="relative"
                                    cursor="text"
                                    borderWidth={variant !== "unstyled" ? "1px" : "0"}
                                    borderRadius="sm"
                                    borderColor={isFocused ? "blue.600" : "gray.300"}
                                    _hover={{
                                        borderColor: "gray.300"
                                    }}
                                    _focusWithin={{
                                        borderColor: "blue.500",
                                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                                    }}
                                    minH={multiple && selectedValue?.length > 0 ? "57px" : "57px"}
                                    bg={disabled ? "gray.100" : ""}
                                    px={2}
                                    pt={3}
                                >
                                    <Flex
                                        flexWrap="wrap"
                                        gap={1}
                                        alignItems="center"
                                        border="none"
                                        borderColor="gray.300"
                                        borderRadius="md"
                                        position="relative"
                                    >
                                        {multiple && selectedValue?.length > 0 &&
                                            selectedValue.map((option, index) => (
                                                <Tag
                                                    key={index}
                                                    size="sm"
                                                    borderRadius="md"
                                                    variant="solid"
                                                    colorScheme="blue"
                                                >
                                                    <TagLabel>{get(option, labelPath)}</TagLabel>
                                                    {!disabled && !isView && !readOnly && (
                                                        <TagCloseButton onClick={(e) => removeTag(index, e)} />
                                                    )}
                                                </Tag>
                                            ))
                                        }

                                        {/* WRAPPER cho input để không bị width: 100% */}
                                        <Box flex="1" minW="100px" >
                                            <Input
                                                ref={inputRef}
                                                mt={1}
                                                w="100%"
                                                border="none"
                                                _focus={{ outline: "none" }}
                                                variant="unstyled"
                                                placeholder={
                                                    (!multiple || !selectedValue?.length)
                                                        ? placeholder ?? `Please select ${label?.toLowerCase() || "an option"}`
                                                        : ""
                                                }
                                                value={isOpen ? inputValue : inputValue || formatSelectedValues(selectedValue)}
                                                onChange={handleInputChange}
                                                onBlur={() => {
                                                    onBlur();
                                                    setIsFocused(false);
                                                }}
                                                onFocus={() => {
                                                    setIsOpen(true);
                                                    setIsFocused(true);
                                                }}
                                                size="md"
                                                isDisabled={disabled}
                                                isReadOnly={isView || readOnly}
                                                {...inputProps}
                                            />
                                        </Box>

                                        {/* Chevron icon */}
                                        <Box
                                            position="absolute"
                                            right="8px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            cursor="pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(!isOpen);
                                                setIsFocused(true);
                                                if (!isOpen) {
                                                    // If opening the dropdown, update position after a small delay
                                                    setTimeout(updateDropdownPosition, 0);
                                                }
                                            }}
                                            zIndex={2}
                                        >
                                            {isOpen ? (
                                                <ChevronUpIcon color="gray.500" boxSize={5} />
                                            ) : (
                                                <ChevronDownIcon color="gray.500" boxSize={5} />
                                            )}
                                        </Box>
                                    </Flex>
                                </Box>

                                {loading && (
                                    <Spinner
                                        size="sm"
                                        position="absolute"
                                        right="12px"
                                        top="50%"
                                        transform="translateY(-50%)"
                                        zIndex={1}
                                    />
                                )}

                                {/* Dropdown - Using Portal to render outside normal DOM flow */}
                                {isOpen && (
                                    <Portal>
                                        <List
                                            ref={dropdownRef}
                                            position="fixed"
                                            zIndex={19000}
                                            bg="white"
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            boxShadow="lg"
                                            overflowY="auto"
                                            style={{
                                                width: `${dropdownPosition.width}px`,
                                                top: `${dropdownPosition.top}px`,
                                                left: `${dropdownPosition.left}px`,
                                                maxHeight: `${dropdownPosition.maxHeight}px`,
                                            }}
                                        >
                                            {filteredOptions.length > 0 ? (
                                                filteredOptions.map((option) => {
                                                    const isSelected = isOptionSelected(option, selectedValue);

                                                    return (
                                                        <ListItem
                                                            key={get(option, valuePath)}
                                                            px={3}
                                                            py={2}
                                                            cursor="pointer"
                                                            bg={isSelected ? "blue.100" : "white"}
                                                            _hover={{ bg: isSelected ? "blue.300" : "gray.100" }}
                                                            onClick={() => handleSelect(option)}
                                                        >
                                                            {renderOption ? (
                                                                renderOption(option, isSelected)
                                                            ) : (
                                                                <Text
                                                                    noOfLines={1}
                                                                    title={get(option, labelPath)}
                                                                    fontWeight={isSelected ? "medium" : "normal"}
                                                                >
                                                                    {labelPath2
                                                                        ? `${get(option, labelPath2)} - ${get(option, labelPath)}`
                                                                        : get(option, labelPath)}
                                                                </Text>
                                                            )}
                                                        </ListItem>
                                                    );
                                                })
                                            ) : (
                                                <Box p={3}>
                                                    <Text color="gray.500">No options available</Text>
                                                </Box>
                                            )}
                                        </List>
                                    </Portal>
                                )}
                            </Box>

                            {error && isHasMessageError && <FormErrorMessage>{error.message}</FormErrorMessage>}
                            {helperText && <FormHelperText>{helperText}</FormHelperText>}
                        </FormControl>
                    );
                }}
            />
        </Box>
    );
};

CoreSelectCustom.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    control: PropTypes.object,
    name: PropTypes.string.isRequired,
    options: PropTypes.array,
    inputLabelProps: PropTypes.object,
    inputProps: PropTypes.object,
    inputContainerProps: PropTypes.object,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    valuePath: PropTypes.string,
    labelPath: PropTypes.string,
    labelPath2: PropTypes.string,
    loading: PropTypes.bool,
    isHasMessageError: PropTypes.bool,
    returnValueType: PropTypes.string,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    isCreateAble: PropTypes.bool,
    rules: PropTypes.object,
    defaultValue: PropTypes.any,
    size: PropTypes.string,
    errCustom: PropTypes.string,
    variant: PropTypes.string,
    isViewProp: PropTypes.bool,
    onChangeValue: PropTypes.func,
    onAfterChangeValue: PropTypes.func,
    renderOption: PropTypes.func,
};

export default React.memo(CoreSelectCustom);