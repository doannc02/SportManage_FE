import { Box, Button, GridItem, Text } from "@chakra-ui/react";
import CoreTable from "../../atoms/CoreTable";
import PropTypes from "prop-types";

const CustomerAddressForm = (props) => {
  
    const {onOpenShippingModal, shippingAddressFields, columnShippingAddresses, dataTableShippingAddresses} = props
  return (
    <>
      {/* Shipping addresses section */}
      <GridItem colSpan={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
          flexDirection={{ base: "column", md: "row" }}
          mb={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            Địa chỉ giao hàng
          </Text>
          <Button colorScheme="blue" onClick={onOpenShippingModal}>
            + Thêm địa chỉ giao hàng
          </Button>
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
CustomerAddressForm.propTypes = {
  onOpenShippingModal: PropTypes.func.isRequired,
  shippingAddressFields: PropTypes.array.isRequired,
  columnShippingAddresses: PropTypes.array.isRequired,
  dataTableShippingAddresses: PropTypes.array.isRequired,
};

export default CustomerAddressForm;
