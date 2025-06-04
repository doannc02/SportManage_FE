import { FaCheck, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa"
import ShippingAddressModal from "../shared/dialog/dialog-add-shipping-address"
import { Badge, Box, Button, Flex, Icon, Spinner, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { saveUser } from "../../services/admins/users"
import { useQueryInfoCurrentCustomer } from "../../services/customers/current-infos"

export const AddressInfo = ({ onChange }) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data, isLoading, refetch } = useQueryInfoCurrentCustomer()

    const dataAddress = data?.shippingAddresses ?? []
    const defaultAddress = dataAddress.find(i => i.isDefault)
    const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? null)
    const [pendingAddressId, setPendingAddressId] = useState(null)

    const { mutate, isLoading: isLoadingSubmit } = useMutation(saveUser, {
        onError: (err) =>
            toast({ title: "Lỗi", description: err.message, status: "error" }),
        onSuccess: () => {
            refetch()
            toast({ title: "Thành công", description: "Cập nhật địa chỉ thành công!", status: "success" })
        }
    })

    const handleSelectAddress = (id) => {
        if (id === selectedAddressId) return
        setSelectedAddressId(id)
        setPendingAddressId(id)
        if (onChange) onChange(id)
    }

    useEffect(() => {
        if (selectedAddressId && onChange) {
            onChange(selectedAddressId)
        }
    }, [selectedAddressId])


    useEffect(() => {
        if (!pendingAddressId) return

        const timeout = setTimeout(() => {
            const updatedAddresses = dataAddress.map(addr => ({
                ...addr,
                isDefault: addr.id === pendingAddressId
            }))

            mutate({
                input: {
                    ...data,
                    shippingAddresses: updatedAddresses
                },
                method: 'put'
            })
        }, 2000)

        return () => clearTimeout(timeout)
    }, [pendingAddressId])

    const handleAddNewAddress = (newAddress) => {
        const newAddressId = crypto.randomUUID()
        const updatedAddresses = [...dataAddress]

        if (newAddress.isDefault) {
            updatedAddresses.forEach(addr => addr.isDefault = false)
        }

        updatedAddresses.push({
            ...newAddress,
            id: newAddressId,
            isDefault: newAddress.isDefault || dataAddress.length === 0
        })

        mutate({
            input: {
                ...data,
                shippingAddresses: updatedAddresses
            }, method: 'put'
        })

        setSelectedAddressId(newAddressId)
        onClose()
    }

    useEffect(() => {
        if (dataAddress.length > 0 && !selectedAddressId) {
            const defaultAddr = dataAddress.find(i => i.isDefault)
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id)
            }
        }
    }, [dataAddress, selectedAddressId])

    return (
        <Box p={4} borderWidth="1px" rounded="md">
            <Text fontWeight="bold" mb={4}>
                Địa chỉ nhận hàng
            </Text>

            {isLoading || isLoadingSubmit ? (
                <Flex justify="center" p={6}>
                    <Spinner size="lg" />
                </Flex>
            ) : dataAddress.length === 0 ? (
                <Box textAlign="center" p={6} border="1px dashed gray" rounded="md">
                    <Text mb={3}>Bạn chưa có địa chỉ nhận hàng nào.</Text>
                    <Button colorScheme="teal" onClick={onOpen}>
                        + Thêm địa chỉ mới
                    </Button>
                </Box>
            ) : (
                <Stack spacing={4}>
                    {dataAddress.map((addr) => {
                        const isSelected = selectedAddressId === addr.id
                        return (
                            <Box
                                key={addr.id}
                                p={4}
                                borderWidth="1px"
                                borderColor={isSelected ? "teal.500" : "gray.200"}
                                bg={isSelected ? "teal.50" : "white"}
                                rounded="lg"
                                cursor="pointer"
                                boxShadow={isSelected ? "md" : "sm"}
                                onClick={() => handleSelectAddress(addr.id)}
                                transition="all 0.2s"
                                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                            >
                                <Flex justify="space-between" align="center" gap={4}>
                                    <Box flex="1" minW="0">
                                        <Flex align="center" gap={2} wrap="wrap" mb={1}>
                                            <Icon as={FaUserAlt} color="gray.600" />
                                            <Text fontWeight="medium" isTruncated>
                                                {addr.recipientName}
                                            </Text>
                                            {addr.isDefault && (
                                                <Badge colorScheme="blue" fontSize="xs">
                                                    Mặc định
                                                </Badge>
                                            )}
                                            {isSelected && (
                                                <Badge colorScheme="green" fontSize="xs">
                                                    Đã chọn
                                                </Badge>
                                            )}
                                        </Flex>

                                        <Flex align="center" gap={2} mb={1}>
                                            <Icon as={FaMapMarkerAlt} color="gray.500" />
                                            <Text fontSize="sm" color="gray.700" isTruncated>
                                                {addr.addressLine}, {addr.ward}, {addr.district}, {addr.city}
                                            </Text>
                                        </Flex>

                                        <Text fontSize="sm" color="gray.600">
                                            SĐT: {addr.phone}
                                        </Text>
                                    </Box>

                                    {isSelected && (
                                        <Icon as={FaCheck} color="teal.500" boxSize={6} />
                                    )}
                                </Flex>
                            </Box>
                        )
                    })}
                    <Button
                        onClick={onOpen}
                        colorScheme="teal"
                        variant="outline"
                        leftIcon={<FaMapMarkerAlt />}
                        alignSelf="flex-start"
                    >
                        Thêm địa chỉ mới
                    </Button>
                </Stack>
            )}

            <ShippingAddressModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleAddNewAddress}
            />
        </Box>
    )
}