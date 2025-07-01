import { Box, GridItem, Text } from "@chakra-ui/react";
import CoreTable from "../../atoms/CoreTable";
import PropTypes from "prop-types";
import React from "react";

const CustomerAddressViewContent = (props) => {
  const {
    shippingAddressFields,
    columnShippingAddresses,
    dataTableShippingAddresses,
  } = props;
  return (
    <>
      {/* Shipping addresses section */}
      <GridItem colSpan={12} mt={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            Địa chỉ giao hàng
          </Text>
        </Box>

        {shippingAddressFields.length > 0 ? (
          <CoreTable
            columns={columnShippingAddresses}
            data={dataTableShippingAddresses}
            paginationHidden
          />
        ) : (
          <Box p={4} textAlign="center" borderWidth={1} borderRadius="md">
            <Text color="gray.500">Chưa có địa chỉ giao hàng nào</Text>
          </Box>
        )}
      </GridItem>
    </>
  );
};
CustomerAddressViewContent.propTypes = {
  shippingAddressFields: PropTypes.array.isRequired,
  columnShippingAddresses: PropTypes.array.isRequired,
  dataTableShippingAddresses: PropTypes.array.isRequired,
};
export default React.memo(CustomerAddressViewContent);
