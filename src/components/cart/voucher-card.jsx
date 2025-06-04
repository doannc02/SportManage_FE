import { Badge, Card, Flex, Icon, Tag, TagLabel, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsCheck2Circle } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";

// Voucher Card Component
export const VoucherCard = ({ voucher, isSelected, onSelect, cartTotal }) => {
    const isApplicable = cartTotal >= voucher.minOrderValue;
    const bgColor = useColorModeValue(
        isSelected ? "teal.50" : "white",
        isSelected ? "teal.900" : "gray.800"
    );
    const borderColor = useColorModeValue(
        isSelected ? "teal.400" : "gray.200",
        isSelected ? "teal.400" : "gray.600"
    );

    const discount = voucher?.discountTypeDisplay === "Percentage"
        ? `${voucher.discountValue}%`
        : `${voucher.discountValue.toLocaleString()} VND`;

    return (
        <Card
            as={motion.div}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            cursor="pointer"
            p={3}
            mb={2}
            onClick={() => onSelect(voucher)}
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow={isSelected ? "md" : "sm"}
            position="relative"
            overflow="hidden"
        >
            {isSelected && (
                <Icon
                    as={BsCheck2Circle}
                    position="absolute"
                    top={2}
                    right={2}
                    boxSize={5}
                    color="teal.500"
                />
            )}

            <Flex direction="column" gap={2}>
                <Flex align="center">
                    <Icon as={MdOutlineLocalOffer} color="teal.500" boxSize={5} mr={2} />
                    <Text fontWeight="bold" noOfLines={1}>{voucher.name}</Text>
                </Flex>

                <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                        Mã: <Text as="span" fontWeight="medium">{voucher.code}</Text>
                    </Text>
                    <Tag
                        size="sm"
                        colorScheme={isSelected ? "teal" : "gray"}
                        variant={isSelected ? "solid" : "subtle"}
                    >
                        <TagLabel>{discount}</TagLabel>
                    </Tag>
                </Flex>

                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                    Đơn tối thiểu: {voucher?.minOrderValue.toLocaleString()} VND
                </Text>

                {!isApplicable && (
                    <Badge colorScheme="red" alignSelf="flex-start" fontSize="xs">
                        Chưa đủ điều kiện
                    </Badge>
                )}
            </Flex>
        </Card>
    );
};

import PropTypes from "prop-types";

VoucherCard.propTypes = {
    voucher: PropTypes.shape({
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        minOrderValue: PropTypes.number.isRequired,
        discountTypeDisplay: PropTypes.string.isRequired,
        discountValue: PropTypes.number.isRequired,
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    cartTotal: PropTypes.number.isRequired,
};