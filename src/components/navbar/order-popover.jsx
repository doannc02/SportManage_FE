import { Box, Flex } from "@chakra-ui/react";
import { PackageCheck } from "lucide-react";
import { Popover } from "antd";

const OrderPopover = () => {
  return (
    <>
      <Popover content={"Đơn hàng"}>
        <Flex
          alignItems="center"
          cursor="pointer"
          _hover={{ bg: "gray.50", borderRadius: "md", boxShadow: "sm" }}
          px={4}
          py={2}
          transition="all 0.2s"
          position="relative"
          minW="48px"
        >
          <Box position="relative" display="flex" alignItems="center" h="32px">
            <PackageCheck strokeWidth={1} />
          </Box>
        </Flex>
      </Popover>
    </>
  );
};

export default OrderPopover;
