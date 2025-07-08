// components/ShippingAddressModal.tsx
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Grid, GridItem, Button, FormControl,
    Checkbox
} from "@chakra-ui/react";
import React, { startTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import CoreInput from "../../atoms/CoreInput";
import CoreAutoComplete from "../../atoms/CoreAutoComplete";
import { useQueryAddressLv1, useQueryAddressLv2, useQueryAddressLv3 } from "../../../services/common";
import { InputAdornment } from "@mui/material";
import { useQueryInfoCurrentCustomer } from "../../../services/customers/current-infos";


const ShippingAddressModal = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const { data } = useQueryInfoCurrentCustomer()
    console.log(data?.phone);
    
    const form = useForm({
        defaultValues: {
            recipientName: "",
            phone: data?.phone | "",
            addressLine: "",
            country: "Việt Nam",
            countryId: "",
            city: "",
            cityId: "",
            district: "",
            ward: "",
            postalCode: "",
            isDefault: false
        }
    })


    // Reset các trường con nếu cha thay đổi
    useEffect(() => {
        form.setValue('district', null);
        form.setValue('ward', null);
    }, [form.watch('cityId')]);

    const handleClose = () => {
        onClose();
        form.reset();
    };

    const { data: dataAddressLv1, isLoading: isLoadingAddressLv1 } = useQueryAddressLv1()
    const { data: dataAddressLv2, isLoading: isLoadingAddressLv2 } = useQueryAddressLv2({
        id: form.watch('cityId')
    }, {
        enabled: !!form.watch('cityId')
    })
    const { data: dataAddressLv3, isLoading: isLoadingAddressLv3 } = useQueryAddressLv3({
        id: form.watch('district')
    }, {
        enabled: !!form.watch('district')
    })


    const onSubmitAddress = form.handleSubmit(async (data) => {
        const newAddressId = crypto.randomUUID();

        // Get selected city, district, ward names
        const selectedCity = dataAddressLv1?.data?.find(item => item.id === data.cityId)?.full_name || '';
        const selectedDistrict = dataAddressLv2?.data?.find(item => item.id === data.district)?.full_name || '';
        const selectedWard = dataAddressLv3?.data?.find(item => item.id === data.ward)?.full_name || '';

        // Reset shipping form and close modal
        onSubmit({
            ...data,
            id: newAddressId,
            city: selectedCity,
            district: selectedDistrict,
            ward: selectedWard,
            country: "Việt Nam"
        })
        form.reset();
        onClose();

    })

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent as="form" onSubmit={form.handleSubmit(onSubmit)}>
                <ModalHeader>Thêm địa chỉ giao hàng</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={[12, 6]}>
                            <CoreInput
                                control={form.control}
                                name='recipientName'
                                label='Tên người nhận'
                                placeholder='Nhập tên người nhận'
                                required
                                rules={{ required: "Trường này là bắt buộc!" }}
                                error={form.formState.errors.recipientName?.message}
                            />
                        </GridItem>

                        <GridItem colSpan={[12, 6]}>
                            <CoreInput
                                control={form.control}
                                readOnly
                                name='phone'
                                label='Số điện thoại'
                                placeholder='Nhập số điện thoại'
                                required
                                rules={{ required: "Trường này là bắt buộc!" }}
                                error={form.formState.errors.phone?.message}
                            />
                        </GridItem>

                        <GridItem colSpan={12}>
                            <CoreInput
                                control={form.control}
                                name='addressLine'
                                label='Địa chỉ chi tiết'
                                placeholder='Nhập địa chỉ chi tiết'
                                required
                                rules={{ required: "Trường này là bắt buộc!" }}
                                error={form.formState.errors.addressLine?.message}
                            />
                        </GridItem>

                        <GridItem colSpan={[12, 6]}>
                            <CoreInput
                                control={form.control}
                                name='country'
                                label='Quốc gia'
                                defaultValue='Việt Nam'
                                disabled
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <img
                                                src="https://flagcdn.com/w40/vn.png"
                                                alt="VN"
                                                width={25}
                                                height={20}
                                                style={{ borderRadius: 2 }}
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <input type="hidden" {...form.register('countryId')} value="VN" />
                        </GridItem>

                        <GridItem colSpan={[12, 6]}>
                            <CoreAutoComplete
                                loading={isLoadingAddressLv1}
                                options={(dataAddressLv1?.data ?? []).map(item => ({
                                    value: item.id,
                                    label: item.full_name
                                }))}
                                control={form.control}
                                name='cityId'
                                label='Tỉnh/Thành phố'
                                required
                                rules={{ required: "Trường này là bắt buộc!" }}
                                placeholder="Chọn tỉnh/thành phố"
                            />
                        </GridItem>

                        <GridItem colSpan={[12, 6]}>
                            <CoreAutoComplete
                                loading={isLoadingAddressLv2}
                                options={(dataAddressLv2?.data ?? []).map(item => ({
                                    value: item.id,
                                    label: item.full_name
                                }))}
                                control={form.control}
                                name='district'
                                label='Quận/Huyện'
                                placeholder='Chọn quận/huyện'
                                isDisabled={!form.watch('cityId')}
                                required
                                rules={{ required: "Trường này là bắt buộc!" }}
                            />
                        </GridItem>

                        <GridItem colSpan={[12, 6]}>
                            <CoreAutoComplete
                                loading={isLoadingAddressLv3}
                                options={(dataAddressLv3?.data ?? []).map(item => ({
                                    value: item.id,
                                    label: item.full_name
                                }))}
                                control={form.control}
                                name='ward'
                                label='Xã/Phường'
                                placeholder='Chọn xã/phường'
                                isDisabled={!form.watch('district')}
                                required
                                rules={{ required: "Trường này là bắt buộc!" }}
                            />
                        </GridItem>

                        <GridItem colSpan={[12, 6]}>
                            <CoreInput
                                control={form.control}
                                name='postalCode'
                                label='Mã bưu điện'
                                placeholder='Nhập mã bưu điện'
                                error={form.formState.errors.postalCode?.message}
                            />
                        </GridItem>

                        <GridItem colSpan={12}>
                            <FormControl display="flex" alignItems="center" mt={2}>
                                <Checkbox
                                    colorScheme="blue"
                                    {...form.register('isDefault')}
                                >
                                    Đặt làm địa chỉ mặc định
                                </Checkbox>
                            </FormControl>
                        </GridItem>
                    </Grid>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onSubmitAddress} isLoading={form.formState.isSubmitting}>
                        Thêm địa chỉ
                    </Button>
                    <Button variant="ghost" onClick={handleClose}>
                        Hủy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default React.memo(ShippingAddressModal);
