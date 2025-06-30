import { Box, Button, GridItem, Text, VStack, Flex } from "@chakra-ui/react";
import { DEFAULT_COLOR } from "../../../const/enum";
import { ArrowLeft, MapPinCheck, User } from "lucide-react";
import CustomerInformationForm from "../../../components/customer/customer-profile/customer-information-form";
import ShippingAddressModal from "../../../components/shared/dialog/dialog-add-shipping-address";
import CustomerAddressForm from "../../../components/customer/customer-profile/customer-address-form";
import { ConfigProvider, Tabs } from "antd";
import useCustomerProfile from "./use-customer-profile";
import { FormProvider } from "react-hook-form";

function CustomerProfile() {
  const [
    {
      dataTableShippingAddresses,
      isLoadingSubmit,
      isOpenShippingModal,
      columnShippingAddresses,
      shippingAddressFields,
      methodForm,
    },
    {
      navigate,
      onOpenShippingModal,
      onCloseShippingModal,
      appendShippingAddress,
      onSubmit,
      setValue,
      setDefaultAddressId,
    },
  ] = useCustomerProfile();

  // Đổi cách sử dụng `itemsTabs` để linh hoạt hơn trong render
  // Các icon có thể được truyền trực tiếp vào Tabs component của Ant Design
  const itemsTabs = [
    {
      key: "1",
      label: (
        <Flex align="center" gap={2}>
          <User strokeWidth={1.5} size={18} />
          <Text>Thông tin chung</Text>
        </Flex>
      ),
      children: (
        <CustomerInformationForm
          isLoadingSubmit={isLoadingSubmit}
        />
      ),
    },
    {
      key: "2",
      label: (
        <Flex align="center" gap={2}>
          <MapPinCheck strokeWidth={1.5} size={18} />
          <Text>Địa chỉ</Text>
        </Flex>
      ),
      children: (
        <CustomerAddressForm
          onOpenShippingModal={onOpenShippingModal}
          shippingAddressFields={shippingAddressFields}
          columnShippingAddresses={columnShippingAddresses}
          dataTableShippingAddresses={dataTableShippingAddresses}
        />
      ),
    },
  ];

  return (
    <Box
      minH="100vh" 
      bg="gray.50" 
      p={{ base: 4, md: 8 }} 
      textAlign='center'
    >
      {/* Header Section */}
      <VStack spacing={4} align="stretch" mb={8}>
        <Flex justify="space-between" align="center">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/")}
            colorScheme="gray" 
            _hover={{ bg: "gray.100" }}
          >
            Trở về trang chủ
          </Button>
        </Flex>

        <Box
          bg="white"
          boxShadow="lg" 
          borderRadius="xl" 
          p={{ base: 6, md: 8 }}
          textAlign="center"
          border="1px solid" 
          borderColor="gray.100"
        >
          <Text
            fontSize={{ base: "2xl", md: "3xl" }} 
            fontWeight="extrabold" 
            color="teal.700" 
            mb={2}
          >
            Trang thông tin cá nhân
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
          >
            Quản lý thông tin cá nhân và địa chỉ nhận hàng của bạn.
          </Text>
        </Box>
      </VStack>

      {/* Main Content Area */}
      <FormProvider {...methodForm}>
        <form onSubmit={onSubmit}>
          <Box
            bg="white"
            boxShadow="lg"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor="gray.100"
          >
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: DEFAULT_COLOR,
                  borderRadius: 8, 
                },
                components: {
                  Tabs: {
                    cardBg: 'white',
                    cardPadding: '10px 16px',
                    horizontalItemPadding: '10px 16px',
                    itemSelectedColor: DEFAULT_COLOR,
                    itemHoverColor: DEFAULT_COLOR,
                    inkBarColor: DEFAULT_COLOR,
                    itemColor: 'gray.600',
                  },
                },
              }}
            >
              <Tabs
                defaultActiveKey="1"
                items={itemsTabs}
                size="large" 
                tabPosition="top"
              />
            </ConfigProvider>
          </Box>

          {/* Action Buttons */}
          <GridItem colSpan={12} mt={8}>
            <VStack spacing={4}>
              <Button
                isLoading={isLoadingSubmit}
                colorScheme="teal" 
                size="lg"
                type="submit"
                borderRadius="lg" 
                px={10}
              >
                Cập nhật thông tin
              </Button>
              <Text
                fontSize="sm" 
                textAlign={"center"}
                fontStyle="italic"
                color="gray.500"
              >
                (*) Vui lòng điền đầy đủ thông tin trước khi gửi.
              </Text>
            </VStack>
          </GridItem>
        </form>
      </FormProvider>

      {/* Modal for adding shipping address */}
      <ShippingAddressModal
        isOpen={isOpenShippingModal}
        onClose={onCloseShippingModal}
        onSubmit={(data) => {
          const newAddressId = crypto.randomUUID();

          if (data.isDefault) {
            const updatedAddresses = shippingAddressFields.map((addr) => ({
              ...addr,
              isDefault: false,
            }));
            setValue("shippingAddresses", updatedAddresses);
            setDefaultAddressId(newAddressId);
          }
          appendShippingAddress(data);
        }}
      />
    </Box>
  );
}
export default CustomerProfile;