import { Box, Divider, Flex, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Progress, Stack, Tag, Text, useColorModeValue } from "@chakra-ui/react"
import { BsInfoCircle } from "react-icons/bs"

export const InfoDetailPayment = ({ cartTotal, selectedVoucher, voucherDiscount, accentColor }) => {
    return <Stack spacing={3}>
        <Flex justify="space-between">
            <Text color={useColorModeValue("gray.600", "gray.400")}>Tạm tính:</Text>
            <Text>{cartTotal.toLocaleString()} VND</Text>
        </Flex>

        <Flex justify="space-between">
            <Text color={useColorModeValue("gray.600", "gray.400")}>Phí vận chuyển:</Text>
            <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                    <Flex as="span" align="center" cursor="pointer">
                        <Text>Miễn phí</Text>
                        <Icon as={BsInfoCircle} ml={1} boxSize={3} color="gray.400" />
                    </Flex>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="medium">Thông tin vận chuyển</PopoverHeader>
                    <PopoverBody>
                        <Text fontSize="sm">
                            Đơn hàng trên 500,000 VND được miễn phí vận chuyển toàn quốc.
                        </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>

        <Flex justify="space-between">
            <Flex align="center">
                <Text color={useColorModeValue("green.600", "green.400")}>Giảm giá:</Text>
                {selectedVoucher && (
                    <Tag size="sm" colorScheme="green" ml={2} variant="subtle">
                        Mã: {selectedVoucher.code} -  {selectedVoucher.name}
                    </Tag>
                )}
            </Flex>
            <Text color={useColorModeValue("green.600", "green.400")}>
                -{voucherDiscount.toLocaleString()} VND
            </Text>
        </Flex>

        <Divider />

        <Flex justify="space-between" align="center">
            <Text fontWeight="bold">Tổng cộng:</Text>
            <Text fontWeight="bold" fontSize="xl" color={accentColor}>
                {(cartTotal - voucherDiscount).toLocaleString()} VND
            </Text>
        </Flex>

        {/* Progress bar for free shipping */}
        {cartTotal < 500000 && (
            <Box mt={1}>
                <Flex justify="space-between" fontSize="xs" mb={1}>
                    <Text>Mua thêm {(500000 - cartTotal).toLocaleString()}đ để được miễn phí vận chuyển</Text>
                    <Text>{Math.round((cartTotal / 500000) * 100)}%</Text>
                </Flex>
                <Progress
                    value={(cartTotal / 500000) * 100}
                    size="xs"
                    colorScheme="teal"
                    borderRadius="full"
                />
            </Box>
        )}
    </Stack>
}