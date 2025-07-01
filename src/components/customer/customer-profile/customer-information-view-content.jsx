import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Grid,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import useCustomerProfile from "../../../pages/user/customer-profile/use-customer-profile";
import { Mail, ScanQrCode, VenusAndMars } from "lucide-react";

const CustomerInformationViewContent = () => {
  const [{ detailData }] = useCustomerProfile();

  return (
    <Box bg="white" p={{ base: 5, md: 8 }}>
      <Flex justify="flex-end">
        <Icon as={LockIcon} color="teal.500" boxSize={5} />
      </Flex>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <VStack spacing={2} align="center" minW="150px">
          <Avatar src={detailData?.avatarUrl} size="2xl" />
          <Text fontSize={"xl"} fontWeight="medium">
            {detailData?.user?.username}
          </Text>
        </VStack>
        <Grid
          flex="1"
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
        >
          <Flex flexDirection={"column"} gap={2}>
            <LabelValue
              label="Email"
              value={detailData?.user?.email}
              icon={<Mail size={20} strokeWidth={1.5} />}
            />
            <LabelValue
              label="ID"
              value={detailData?.user?.id}
              icon={<ScanQrCode size={20} strokeWidth={1.5} />}
            />
            <LabelValue
              label="Giới tính"
              value={detailData?.gender}
              icon={<VenusAndMars size={20} strokeWidth={1.5} />}
            />
          </Flex>
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <LabelValue
                label="Số điện thoại"
                value={detailData?.phone}
                isLink
              />
              <LabelValue label="Tuổi" value={detailData?.age} />
              <LabelValue label="Vai trò" value={"Khách hàng"} />
              <LabelValue label="Quốc tịch" value="Việt Nam" />
              <LabelValue label="Nơi ở" value={detailData?.address} />
              <LabelValue
                label="Số địa chỉ nhận hàng"
                value={detailData?.shippingAddresses?.length}
              />
            </Grid>
          </Box>
        </Grid>
      </Flex>
    </Box>
  );
};

import PropTypes from "prop-types";

const LabelValue = ({ label, value, icon = null, isLink = false }) => (
  <HStack spacing={2}>
    {icon && icon}
    <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
      <Text fontSize="md" color="gray.500" fontWeight={"medium"}>
        {label}
      </Text>
    </Flex>
    <Text
      fontSize="sm"
      fontWeight="medium"
      color={isLink ? "blue.500" : "gray.800"}
      cursor={isLink ? "pointer" : "default"}
      _hover={isLink ? { textDecoration: "underline" } : undefined}
    >
      {value}
    </Text>
  </HStack>
);

LabelValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  icon: PropTypes.node,
  isLink: PropTypes.bool,
};

export default React.memo(CustomerInformationViewContent);
