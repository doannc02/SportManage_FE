import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { paymentMethodEnums } from "../../const/enum"
import { useEffect, useState } from "react"

export const SelectPaymentMethod = ({ onChange }) => {
    const [selected, setSelected] = useState("CashOnDelivery")

    useEffect(() => {
        onChange?.("CashOnDelivery")
    }, [])

    const handleChange = (value) => {
        setSelected(value)
        onChange?.(value)
    }

    return (
        <Box p={4} borderWidth="1px" rounded="md" mb={6}>
            <Text fontWeight="bold" mb={4}>
                Phương thức thanh toán
            </Text>

            <Stack spacing={3}>
                {paymentMethodEnums.map((method) => {
                    const isSelected = selected === method.value
                    return (
                        <Box
                            key={method.value}
                            onClick={() => handleChange(method.value)}
                            borderWidth="1px"
                            borderColor={isSelected ? "teal.500" : "gray.200"}
                            bg={isSelected ? "teal.50" : "white"}
                            rounded="md"
                            p={4}
                            cursor="pointer"
                            _hover={{ shadow: "md" }}
                            transition="all 0.2s"
                        >
                            <Flex align="center" gap={3}>
                                <Icon as={method.icon} boxSize={5} color="teal.500" />
                                <Text fontWeight="medium">{method.label}</Text>
                            </Flex>
                        </Box>
                    )
                })}
            </Stack>
        </Box>
    )
}