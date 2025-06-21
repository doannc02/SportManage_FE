import {
  Box,
  Button,
  FormLabel,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import CoreTable from "../../../../components/atoms/CoreTable";
import useDetailProduct from "./useDetail";
import CoreAutoComplete from "../../../../components/atoms/CoreAutoComplete";
import { MultiImageUploader } from "../../../../components/atoms/ImageUploader";

const ProductDetailAdmin = () => {
  const [
    {
      id,
      methodForm,
      columnVariants,
      dataTableVariant,
      dataCategory,
      dataBrands,
      isLoadingBrand,
      isLoadingCategory,
      fieldProductCategories,
      isLoadingSuppliers,
      dataSuppliers,
      isLoadingSubmit,
    },
    {
      append,
      onSubmit,
      appendProdCategory,
      watch,
      setValue,
      removeProdCategory,
    },
  ] = useDetailProduct();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onQuickCreate = async () => {
    appendProdCategory({
      category: {
        name: methodForm.getValues("categoryName"),
        description: methodForm.getValues("categoryDescription"),
        logo: methodForm.getValues("categoryLogo"),
      },
    });

    onClose();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
          {/* Các trường sản phẩm khác */}
          <GridItem colSpan={[12, 12, 3]}>
            <CoreInput
              control={methodForm.control}
              name="name"
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
              required
              rules={{ required: "Trường này là bắt buộc!" }}
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 3]}>
            <CoreAutoComplete
              loading={isLoadingBrand}
              options={(dataBrands?.items ?? []).map((item) => ({
                value: item.id,
                label: item.name + " - " + item?.city,
              }))}
              control={methodForm.control}
              required
              rules={{ required: "Trường này là bắt buộc!" }}
              name="brandId"
              label="Thương hiệu"
              placeholder="Chọn brand"
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 3]}>
            <CoreAutoComplete
              loading={isLoadingSuppliers}
              options={(dataSuppliers?.items ?? []).map((item) => ({
                value: item.id,
                label: item.name + " - " + item?.contactPhone,
              }))}
              control={methodForm.control}
              required
              valuePath="value"
              rules={{ required: "Trường này là bắt buộc!" }}
              name="supplierId"
              label="Nhà cung cấp"
              placeholder="Chọn nhà cung cấp"
            />
          </GridItem>

          <GridItem colSpan={[12, 12, 3]}>
            <Box display="flex" alignItems="flex-end" gap={2}>
              <Box flex={1}>
                <CoreAutoComplete
                  loading={isLoadingCategory}
                  options={(dataCategory?.items ?? []).map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  required
                  rules={{
                    required:
                      fieldProductCategories.length > 0
                        ? null
                        : "Trường này là bắt buộc!",
                  }}
                  control={methodForm.control}
                  name="categoryIds"
                  multiple
                  label="Danh mục sản phẩm"
                  placeholder="Chọn danh mục"
                />
              </Box>
              {!id && (
                <Button
                  height="40px"
                  mb="1"
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={onOpen}
                >
                  + Thêm nhanh
                </Button>
              )}
            </Box>

            {/* Danh sách danh mục đã thêm */}
            {!id
              ? (fieldProductCategories ?? []).length > 0 && (
                  <Box mt={4}>
                    <Box fontWeight="medium" mb={2}>
                      Danh mục đã thêm:
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {(fieldProductCategories ?? []).map((item, idx) => (
                        <Box
                          key={idx}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={3}
                          borderRadius="md"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          boxShadow="sm"
                        >
                          <Box>
                            <Box fontWeight="semibold">
                              {item.category.name}
                            </Box>
                            {item.category.description && (
                              <Box fontSize="sm" color="gray.500">
                                {item.category.description}
                              </Box>
                            )}
                          </Box>
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => {
                              removeProdCategory(idx);
                            }}
                          >
                            Xóa
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )
              : null}
          </GridItem>

          {/* <GridItem colSpan={[12,12, 3]}>
                        <CoreInput
                            control={methodForm.control}
                            name='supplierId'
                            label='Tên nhà cung cấp'
                            placeholder='Chọn nhà cung cấp'
                            required
                            rules={{ required: "Trường này là bắt buộc!" }}
                        />
                    </GridItem> */}

          <GridItem colSpan={4}>
            <FormLabel marginBottom={2}>Chọn ảnh sản phẩm gốc</FormLabel>
            <MultiImageUploader
              width={"86px"}
              defaultValue={watch(`images`)}
              onChange={(urls) => setValue(`images`, urls)}
            />
          </GridItem>

          <GridItem colSpan={12}>
            <CoreInput
              required
              rules={{ required: "Trường này là bắt buộc!" }}
              control={methodForm.control}
              name="description"
              label="Mô tả"
              placeholder="Nhập mô tả"
              multiline
            />
          </GridItem>
          {/* <GridItem colSpan={12}>
                        <Checkbox label='Là vợt cầu lông' />
                    </GridItem> */}
          {/* Bảng variants */}
          <GridItem colSpan={12} mt={4}>
            <Box display="flex" justifyContent="end" mb={2}>
              <Button
                colorScheme="blue"
                onClick={() => append({ name: "", price: 0, images: [] })}
              >
                + Thêm variant
              </Button>
            </Box>
            <CoreTable
              columns={columnVariants}
              paginationHidden
              data={dataTableVariant}
            />
          </GridItem>

          {/* Submit */}
          <GridItem colSpan={12} mt={6}>
            <Box display="flex" justifyContent="center">
              <Button
                loading={isLoadingSubmit}
                colorScheme="teal"
                size="lg"
                type="submit"
              >
                Lưu sản phẩm
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </form>

      {/* Modal thêm nhanh danh mục */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm nhanh danh mục</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CoreInput
              control={methodForm.control}
              name="categoryName"
              label="Tên danh mục"
              placeholder="Nhập tên danh mục"
              required
              rules={{ required: "Trường này là bắt buộc!" }}
            />
            <CoreInput
              sx={{ margin: "25px 0 25px 0" }}
              control={methodForm.control}
              name="categoryDescription"
              label="Mô tả"
              placeholder="Nhập mô tả"
            />
            <CoreInput
              control={methodForm.control}
              name="categoryLogo"
              label="Logo (đường dẫn ảnh)"
              placeholder="Nhập đường dẫn ảnh"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onQuickCreate}>
              Thêm danh mục
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductDetailAdmin;
