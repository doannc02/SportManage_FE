import { Box, Flex } from "@chakra-ui/react";
import {  UserRoundCog } from "lucide-react";
import { Popover } from "antd";

const CustomerPopover = () => {
  return (
    <>
      <Popover content={"Trang cá nhân"}>
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
            <UserRoundCog strokeWidth={1} />
          </Box>
        </Flex>
      </Popover>
    </>
  );
};

export default CustomerPopover;
