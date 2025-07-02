import React from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import useCustomerProfile from "../../../pages/user/customer-profile/use-customer-profile";
import { HeartMinus, Mail, MapPin, PackageSearch, PhoneCall, ScanQrCode, SquareUserRound, VenusAndMars } from "lucide-react";

const CustomerInformationViewContent = () => {
  const [{ detailData }] = useCustomerProfile();

  return (
    <Box bg="white" p={{ base: 5, md: 8 }}>
      <Flex justify="flex-end">
        <Icon as={LockIcon} color="teal.500" boxSize={5} />
      </Flex>

      <Flex direction={{ base: "column", md: "row" }} gap={6} overflow={"auto"}>
        <Grid
          flex="1"
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
        >
          <Flex flexDirection={"column"} gap={2}>
            <LabelValue
              label="Email"
              value={detailData?.user?.email}
              icon={<Mail size={20} strokeWidth={1.25} color="#808897" />}
            />
            <LabelValue
              label="ID"
              value={detailData?.user?.id}
              icon={<ScanQrCode size={20} strokeWidth={1.25} color="#808897" />}
            />
            <LabelValue
              label="Giới tính"
              value={detailData?.gender}
              icon={<VenusAndMars size={20} strokeWidth={1.25} color="#808897"  />}
            />
            <LabelValue label="Quốc tịch" value="Việt Nam" icon={<SquareUserRound size={20} strokeWidth={1.25} color="#808897"  />}/>
          </Flex>
          <Flex flexDirection={"column"} gap={2}> 
            <LabelValue label="Liên lạc" value={detailData?.phone} icon={<PhoneCall size={20} strokeWidth={1.25} color="#808897"/>} />
            <LabelValue label="Tuổi" value={detailData?.age} icon={<HeartMinus size={20} strokeWidth={1.25} color="#808897"/>} />
            <LabelValue label="Nơi ở" value={detailData?.address} icon={<MapPin size={20} strokeWidth={1.25} color="#808897"/>}/>
            <LabelValue
              label="Số địa chỉ nhận hàng"
              value={detailData?.shippingAddresses?.length}
              icon={<PackageSearch size={20} strokeWidth={1.25} color="#808897"/>}
            />
          </Flex>
        </Grid>
      </Flex>
    </Box>
  );
};

import PropTypes from "prop-types";
import { Popover } from "antd";

const LabelValue = ({ label, value, icon = null }) => {
  const displayValue = () => value ?? "-";

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid #DFE1E6"
      mb={2}
      h="40px"
      w={{ base: "500px", md: "100%" }}
    >
      <Flex align="center" gap={2}>
        {icon ?? icon}
        <Text fontWeight="normal" fontSize="14px" color="#808897">
          {label}:
        </Text>
      </Flex>
      <Box
        display="flex"
        justifyContent="flex-end"
        w={window.innerWidth < 768 ? "70%" : "50%"}
      >
        <Popover content={displayValue()} title={label}>
          <Text isTruncated fontSize="16px" color="#43495A" maxW="100%">
            {displayValue()}
          </Text>
        </Popover>
      </Box>
    </Flex>
  );
};

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
