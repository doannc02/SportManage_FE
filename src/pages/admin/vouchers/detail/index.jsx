// File: VoucherDetailAdmin.tsx
import {
    Box,
    Button,
    Grid,
    GridItem,
} from "@chakra-ui/react"
import CoreInput from "../../../../components/atoms/CoreInput"
import { useDetailVoucher } from "./useDetailVoucher"
import CoreDatePicker from "../../../../components/atoms/CoreDatePicker"
import CoreAutoComplete from "../../../../components/atoms/CoreAutoComplete"
import { discountTypeEnums } from "../../../../const/enum"
// import CoreDatePicker from "../../../../components/atoms/CoreDatePicker"

const VoucherDetailAdmin = () => {
    const [
        {
            id,
            methodForm,
            isLoadingSubmit,
            isEdit
        },
        {
            onSubmit
        }
    ] = useDetailVoucher()

    return (
        <form onSubmit={onSubmit}>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
                <GridItem colSpan={[12, 6]}>
                    <CoreInput
                        control={methodForm.control}
                        name="code"
                        label="Mã voucher"
                        placeholder="Nhập mã voucher"
                        required
                        rules={{ required: "Trường này là bắt buộc" }}
                    />
                </GridItem>

                <GridItem colSpan={[12, 6]}>
                    <CoreInput
                        control={methodForm.control}
                        name="name"
                        label="Tên chương trình"
                        placeholder="Nhập tên chương trình"
                        required
                        rules={{ required: "Trường này là bắt buộc" }}
                    />
                </GridItem>
                <GridItem colSpan={[6, 6]}>
                    <CoreDatePicker
                        control={methodForm.control}
                        name="startDate"
                        label="Ngày bắt đầu"
                        required
                    />
                </GridItem>

                <GridItem colSpan={[6, 6]}>
                    <CoreDatePicker
                        control={methodForm.control}
                        name="endDate"
                        label="Ngày kết thúc"
                        required
                    />
                </GridItem>
                <GridItem colSpan={[12, 6]}>
                    <CoreAutoComplete
                        control={methodForm.control}
                        name="discountTypeDisplay"
                        label="Loại giảm giá"
                        placeholder="Chọn loại giảm giá"
                        options={discountTypeEnums}
                    />
                </GridItem>

                <GridItem colSpan={[12, 6]}>
                    <CoreInput
                        control={methodForm.control}
                        name="discountValue"
                        label={methodForm.watch('discountTypeDisplay') === "Percentage" ? "Phần trăm giảm giá (%)" : "Số tiền giảm giá (VND)"}
                        placeholder={methodForm.watch('discountTypeDisplay') === "Percentage" ? "Nhập phần trăm giảm giá" : "Nhập số tiền giảm giá"}
                        type="number"
                    />
                </GridItem>


                <GridItem colSpan={[12, 6]}>
                    <CoreInput
                        control={methodForm.control}
                        name="minOrderValue"
                        label="Giá trị đơn tối thiểu áp dụng"
                        placeholder="Nhập giá trị tối thiểu"
                        type="number"
                    />
                </GridItem>

                <GridItem colSpan={[12, 6]}>
                    <CoreInput
                        control={methodForm.control}
                        name="remainingUsage"
                        label="Tổng số lượng voucher"
                        placeholder="Nhập số lượng"
                        type="number"
                    />
                </GridItem>

                <GridItem colSpan={[12, 6]}>
                    <CoreInput
                        control={methodForm.control}
                        name="remainingUserUsage"
                        label="Số lượng có thể áp dụng cho 1 người dùng"
                        placeholder="Nhập số lượng"
                        type="number"
                    />
                </GridItem>


                <GridItem colSpan={[12, 12]}>
                    <CoreInput
                        control={methodForm.control}
                        name="description"
                        label="Mô tả"
                        placeholder="Nhập mô tả"
                        multiline
                    />
                </GridItem>
                <GridItem colSpan={12}>
                    <Box display="flex" justifyContent="center">
                        <Button isLoading={isLoadingSubmit} colorScheme="teal" size="lg" type="submit">
                            {isEdit ? "Cập nhật voucher" : "Tạo mới voucher"}
                        </Button>
                    </Box>
                </GridItem>
            </Grid>
        </form>
    )
}

export default VoucherDetailAdmin
