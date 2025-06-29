import { Box, Button, GridItem, Text } from "@chakra-ui/react";
import { DEFAULT_COLOR } from "../../../const/enum";
import { ArrowLeft, MapPinCheck, User } from "lucide-react";
import CustomerInformationForm from "../../../components/customer/customer-profile/customer-information-form";
import ShippingAddressModal from "../../../components/shared/dialog/dialog-add-shipping-address";
import CustomerAddressForm from "../../../components/customer/customer-profile/customer-address-form";
import { ConfigProvider, Tabs } from "antd";
import useCustomerProfile from "./use-customer-profile";

function CustomerProfile() {
  const [
    {
      dataTableShippingAddresses,
      isLoadingSubmit,
      isOpenShippingModal,
      columnShippingAddresses,
      shippingAddressFields,
      control,
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

  const itemsTabs = [
    {
      key: "1",
      label: "",
      children: (
        <CustomerInformationForm
          control={control}
          isLoadingSubmit={isLoadingSubmit}
        />
      ),
      icon: <User strokeWidth={1.5} />,
    },
    {
      key: "2",
      label: "",
      icon: <MapPinCheck strokeWidth={1.5} />,
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
    <Box m={4}>
      <Box
        bg="white"
        boxShadow="md"
        borderRadius="lg"
        p={{ base: 4, md: 6 }}
        mb={8}
        textAlign="center"
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="teal.600"
          mb={2}
        >
          Trang thông tin cá nhân
        </Text>
        <Text
          fontSize={{ base: "sm", md: "md" }}
          mt={4}
          gap={2}
          display="flex"
          cursor={"pointer"}
          alignItems="center"
          justifyContent="center"
          color={DEFAULT_COLOR}
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Trở về trang chủ
        </Text>
      </Box>
      <form onSubmit={onSubmit}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: DEFAULT_COLOR,
            },
          }}
        >
          <Tabs defaultActiveKey="1" items={itemsTabs} />
        </ConfigProvider>

        <GridItem colSpan={12} mt={6}>
          <Box display="flex" justifyContent="center">
            <Button
              isLoading={isLoadingSubmit}
              colorScheme="teal"
              size="lg"
              type="submit"
            >
              Cập nhật thông tin
            </Button>
          </Box>
          <Text mt={2} textAlign={"center"} fontStyle="italic" color="orange.500">
           (*) Vui lòng điền đẩy đủ thông tin trước khi gửi
          </Text>
        </GridItem>
      </form>

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



// const CustomerProfile = () => {
//   return (
//     <div>
//       Customer Profile
//     </div>
//   )
// }

// export default CustomerProfile
