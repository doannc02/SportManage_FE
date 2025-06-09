import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Flex,
  useDisclosure,
  Stack,
  Text,
  Avatar,
} from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import { useDetailCategoryAdmin } from "./useDetailCategory";
import CoreLoading from "../../../../components/atoms/CoreLoading";
import { MultiImageUploader } from "../../../../components/atoms/ImageUploader";
import { BASE_URL } from "../../../../configs/auth";
import { useWatch } from "react-hook-form";

const CategoryAdmin = () => {
  const [{ isLoadingQuery, methodForm, isLoadingSubmit }, { onSubmit }] =
    useDetailCategoryAdmin();

  const logoValue = useWatch({ control: methodForm.control, name: "logo" });

  return (
    <>
      {isLoadingQuery ? (
        <CoreLoading />
      ) : (
        <form onSubmit={onSubmit}>
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {/* Tên danh mục */}
            <GridItem colSpan={[12, 8]}>
              <CoreInput
                control={methodForm.control}
                name="name"
                label="Tên danh mục"
                placeholder="Nhập tên danh mục"
                required
                rules={{ required: "Trường này là bắt buộc" }}
              />
            </GridItem>

            {/* Phần logo */}
            <GridItem colSpan={[12, 4]}>
              <Stack spacing={4}>
                <Text fontSize="sm" fontWeight="500">
                  Logo danh mục
                </Text>

                {logoValue ? (
                  <Flex direction="column" gap={3}>
                    <Flex align="center" gap={3}>
                      <Avatar
                        src={`${BASE_URL}${logoValue}`}
                        size="xl"
                        borderRadius="md"
                        bg="gray.100"
                      />
                      <Stack spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => methodForm.setValue("logo", "")}
                        >
                          Xóa logo
                        </Button>
                        <Text fontSize="xs" color="gray.500">
                          Kích thước đề xuất: 200x200px
                        </Text>
                      </Stack>
                    </Flex>
                  </Flex>
                ) : (
                  <Box>
                    <MultiImageUploader
                      name="logo"
                      label=""
                      height="45px"
                      hideLabel
                      defaultValue={methodForm.getValues(`logo`)}
                      onChange={(urls) =>
                        methodForm.setValue(`logo`, urls[0])
                      }
                      maxFiles={1}
                    />
                    <Text mt={2} fontSize="xs" color="gray.500">
                      Kích thước đề xuất: 200x200px
                    </Text>
                  </Box>
                )}
              </Stack>
            </GridItem>

            {/* Mô tả */}
            <GridItem colSpan={12}>
              <CoreInput
                control={methodForm.control}
                name="description"
                label="Mô tả danh mục"
                placeholder="Nhập mô tả"
                multiline
                rows={4}
              />
            </GridItem>

            {/* Nút submit */}
            <GridItem colSpan={12}>
              <Flex justify="flex-end">
                <Button
                  isLoading={isLoadingSubmit}
                  colorScheme="blue"
                  size="lg"
                  type="submit"
                  minW="200px"
                >
                  Lưu thay đổi
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        </form>
      )}
    </>
  );
};

export default CategoryAdmin;
