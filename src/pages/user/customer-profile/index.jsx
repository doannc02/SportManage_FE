import { Box, Button, Text, Flex, HStack, VStack } from "@chakra-ui/react";
import { DEFAULT_COLOR } from "../../../const/enum";
import {
  ArrowLeft,
  MapPinCheck,
  ShoppingBag,
  SquarePen,
  SquareUser,
  Tags,
  User,
} from "lucide-react";
import CustomerInformationForm from "../../../components/customer/customer-profile/customer-information-form";
import ShippingAddressModal from "../../../components/shared/dialog/dialog-add-shipping-address";
import CustomerAddressForm from "../../../components/customer/customer-profile/customer-address-form";
import { Avatar, ConfigProvider, Tabs } from "antd";
import useCustomerProfile from "./use-customer-profile";
import { FormProvider } from "react-hook-form";
import CustomerOverviewDialog from "../../../components/customer/customer-profile/customer-overview-dialog";
import CustomerInformationViewContent from "../../../components/customer/customer-profile/customer-information-view-content";
import CustomerAddressViewContent from "../../../components/customer/customer-profile/customer-address-view-content";
import { useMemo } from "react";

function CustomerProfile() {
  const [
    {
      dataTableShippingAddresses,
      isLoadingSubmit,
      isOpenShippingModal,
      columnShippingAddresses,
      shippingAddressFields,
      methodForm,
      openDialog,
      detailData,
    },
    {
      navigate,
      onOpenShippingModal,
      onCloseShippingModal,
      appendShippingAddress,
      onSubmit,
      setValue,
      setDefaultAddressId,
      handleOpenDialog,
      handleCloseDialog,
    },
  ] = useCustomerProfile();

  const itemsTabs = [
    {
      key: "1",
      label: (
        <Flex align="center" gap={2}>
          <User strokeWidth={1.5} size={18} />
          <Text>Thông tin chung</Text>
        </Flex>
      ),
      children: <CustomerInformationViewContent />,
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
        <CustomerAddressViewContent
          shippingAddressFields={shippingAddressFields}
          columnShippingAddresses={columnShippingAddresses}
          dataTableShippingAddresses={dataTableShippingAddresses}
        />
      ),
    },
  ];
  const MemoCustomerInformationForm = useMemo(
    () => <CustomerInformationForm />,
    []
  );

  const MemoCustomerAddressForm = useMemo(
    () => (
      <CustomerAddressForm
        onOpenShippingModal={onOpenShippingModal}
        shippingAddressFields={shippingAddressFields}
        columnShippingAddresses={columnShippingAddresses}
        dataTableShippingAddresses={dataTableShippingAddresses}
      />
    ),
    [
      onOpenShippingModal,
      shippingAddressFields,
      columnShippingAddresses,
      dataTableShippingAddresses,
    ]
  );

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      textAlign="center"
      pt={{ base: "150px", md: "100px" }}
    >
      {/* Header Section  */}
      <Box
        bgColor="white"
        p={{ base: 4, md: 5 }}
        textAlign="center"
        mb={8}
        position={"fixed"}
        top={{ base: "64px", md: "85px" }}
        left={0}
        right={0}
        zIndex={10}
        boxShadow="sm"
      >
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 0 }}
        >
          <Flex
            justify="flex-start"
            align="center"
            w={{ base: "100%", md: "auto" }}
            mb={{ base: 2, md: 0 }}
          >
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/")}
              colorScheme="gray"
              _hover={{ bg: "gray.100", color: "black" }}
              size={{ base: "sm", md: "md" }}
            >
              Quay lại
            </Button>
          </Flex>
          <Text
            fontSize={{ base: "md", md: "3xl" }}
            fontWeight="bold"
            color="teal.700"
            mb={{ base: 2, md: 0 }}
            textAlign={"center"}
            flex={1}
            letterSpacing="wide"
          >
            Trang thông tin cá nhân
          </Text>
          <Button
            size={{ base: "sm", md: "lg" }}
            color={"white"}
            variant="solid"
            rightIcon={<SquarePen strokeWidth={1.5} size={18} />}
            onClick={handleOpenDialog}
            bgColor={DEFAULT_COLOR}
            _hover={{ bg: "gray.100", color: "black" }}
            w={{ base: "100%", md: "auto" }}
          >
            Cập nhật thông tin
          </Button>
        </Flex>
      </Box>

      <Box
        bg="white"
        boxShadow="lg"
        borderRadius="xl"
        p={{ base: 4, md: 7 }}
        border="1px solid"
        mx={{ base: 2, md: 32 }}
        borderColor="gray.100"
        mb={8}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        gap={6}
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          gap={5}
          alignItems="center"
        >
          <Avatar
            src={detailData?.avatarUrl}
            size={window.innerWidth < 768 ? 100 : 150}
            style={{
              border: "4px solid #319795",
              boxShadow: "0 4px 16px rgba(49,151,149,0.15)",
              background: "#e6fffa",
            }}
          />
          <VStack align="flex-start" spacing={2}>
            <HStack flexWrap="wrap">
              <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                {detailData?.user?.username}
              </Text>
              <Box
                bg="gray.100"
                color="teal.700"
                px={3}
                py={1}
                borderRadius="md"
                fontWeight="semibold"
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <SquareUser size={18} />
                Khách hàng
              </Box>
            </HStack>
            <Text fontSize="md" color="gray.600">
              Điểm thành viên: <b>750</b>
            </Text>
            <Text fontSize="sm" color="gray.500">
              Tham gia từ:{" "}
              {detailData?.user?.createdAt
                ? new Date(detailData.user.createdAt).toLocaleDateString(
                    "vi-VN"
                  )
                : "02/07/2025"}
            </Text>
          </VStack>
        </Box>

        {/* Right section: Stats + Button */}
        <Box w="full" maxW={{ md: "280px" }}>
          <Box
            w="full"
            textAlign="left"
            p={4}
            bg="teal.50"
            borderRadius="lg"
            boxShadow="sm"
            display={{ base: "none", md: "block" }}
          >
            <Box display="flex" alignItems="center" mb={2} gap={2}>
              <Text fontWeight="bold" color="teal.700">
                Thông tin mua hàng
              </Text>
              <Tags size={23} strokeWidth={1.5} />
            </Box>
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="sm">
                <b>Số đơn hàng đã mua:</b>{" "}
                {detailData?.user?.defaultAddress || "15"}
              </Text>
              <Text fontSize="sm">
                <b>Số địa chỉ đã lưu:</b> {shippingAddressFields?.length || 0}
              </Text>
            </VStack>
          </Box>

          <Button
            mt={3}
            variant="outline"
            rightIcon={<ShoppingBag size={20} strokeWidth={1.5} />}
            onClick={() => navigate("/")}
            colorScheme="teal"
            size={{ base: "sm", md: "md" }}
            w="full"
          >
            Đi đến trang mua hàng
          </Button>
        </Box>
      </Box>

      <FormProvider {...methodForm}>
        <Box
          bg="white"
          boxShadow="lg"
          borderRadius="xl"
          p={{ base: 2, md: 4 }}
          border="1px solid"
          mx={{ base: 4, md: 32 }}
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
                  cardBg: "white",
                  cardPadding: "10px 16px",
                  horizontalItemPadding: "10px 16px",
                  itemSelectedColor: DEFAULT_COLOR,
                  itemHoverColor: DEFAULT_COLOR,
                  inkBarColor: DEFAULT_COLOR,
                  itemColor: "gray.600",
                },
              },
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={itemsTabs}
              size="large"
              tabPosition={window.innerWidth < 768 ? "top" : "left"}
            />
          </ConfigProvider>
        </Box>
      </FormProvider>

      <FormProvider {...methodForm}>
        <CustomerOverviewDialog
          isLoading={isLoadingSubmit}
          isOpen={openDialog}
          onClose={handleCloseDialog}
          onConfirm={onSubmit}
          CustomerInformationForm={MemoCustomerInformationForm}
          CustomerAddressForm={MemoCustomerAddressForm}
        />
      </FormProvider>

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
