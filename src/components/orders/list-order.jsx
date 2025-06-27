import { Text, Container, Box, Flex, Button } from "@chakra-ui/react";
import useListOrders from "./use-list-orders";
import PropTypes from "prop-types";
import CoreTable from "../atoms/CoreTable";
import CoreInput from "../atoms/CoreInput";
import CoreSelectCustom from "../atoms/CoreAutoComplete"; // Assuming this is indeed a select/autocomplete component
import { DEFAULT_COLOR, OrderStateOptions } from "../../const/enum";
import StatusChangeDialog from "./state-change-dialog";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from "@chakra-ui/react"; // Import useMediaQuery
import { useMemo } from "react"; // Import useMemo for optimized column filtering

const ListOrder = ({
  userRole, // 'user' hoặc 'admin'
  title = "Danh sách đơn hàng",
  subtitle = "Quản lý và theo dõi các đơn hàng của bạn",
}) => {
  const [
    {
      methodForm,
      columns, // Original columns from useListOrders
      isLoading,
      dataTable,
      totalPages,
      pageNumber,
      pageSize,
      // Dialog state
      isDialogOpen,
      selectedOrder,
      newStatus,
    },
    {
      onChangePage,
      onChangePageSize,
      navigate,
      onReset,
      // Dialog actions
      onStatusChange,
      onConfirmStatusChange,
      onCancelStatusChange,
    },
  ] = useListOrders({ role: userRole });

  // const [isSmallerThanMd] = useMediaQuery("(max-width: 768px)");
  // const [isSmallerThanSm] = useMediaQuery("(max-width: 480px)");

  // // Memoize responsive columns to avoid unnecessary re-renders
  // const responsiveColumns = useMemo(() => {
  //   if (!columns || columns.length === 0) return [];

  //   // Ensure columns have accessorKey defined and filter only visible columns
  //   const hasColumn = (key) => columns.some((col) => col.accessorKey === key);

  //   if (isSmallerThanSm) {
  //     // Only include columns that actually exist
  //     return columns.filter(
  //       (col) =>
  //         (col.accessorKey === "code" && hasColumn("code")) ||
  //         (col.accessorKey === "totalAmount" && hasColumn("totalAmount")) ||
  //         (col.accessorKey === "state" && hasColumn("state")) ||
  //         (col.accessorKey === "actions" && hasColumn("actions"))
  //     );
  //   } else if (isSmallerThanMd) {
  //     return columns.filter(
  //       (col) =>
  //         (col.accessorKey === "code" && hasColumn("code")) ||
  //         (col.accessorKey === "customerName" && hasColumn("customerName")) ||
  //         (col.accessorKey === "totalAmount" && hasColumn("totalAmount")) ||
  //         (col.accessorKey === "createdAt" && hasColumn("createdAt")) ||
  //         (col.accessorKey === "state" && hasColumn("state")) ||
  //         (col.accessorKey === "actions" && hasColumn("actions"))
  //     );
  //   }
  //   return columns;
  // }, [columns, isSmallerThanMd, isSmallerThanSm]);

  return (
    <Container maxW={{ base: "100%", md: "100%", lg: "100%" }}>
      {userRole === "user" && (
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
            {title}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
            {subtitle}
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
      )}

      <Box
        bg="white"
        boxShadow="sm"
        borderRadius="lg"
        px={{ base: 4, md: 8, lg: 10 }}
        py={{ base: 6, md: 8 }}
        mb={6}
      >
        <Flex
          mb={4}
          gap={4}
          justify="flex-start"
          // Use responsive direction and alignment
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "flex-end" }}
        >
          {/* Input for Keyword */}
          <Box w={{ base: "100%", md: "50%", lg: "30%" }}>
            <CoreInput
              control={methodForm.control}
              name="keyWord"
              label="Tìm kiếm"
              placeholder="Nhập tên hoặc mã đơn hàng"
            />
          </Box>
          {/* Select for Order State */}
          <Box w={{ base: "100%", md: "50%", lg: "30%" }}>
            <CoreSelectCustom
              control={methodForm.control}
              name="state"
              label="Trạng thái đơn hàng"
              options={OrderStateOptions}
              placeholder="Chọn trạng thái đơn hàng"
            />
          </Box>
          {/* Reset Filter Button */}
          <Box
            w={{ base: "100%", md: "auto" }} // Full width on base, auto on md
            display="flex"
            alignItems="end"
            justifyContent={{ base: "center", md: "flex-start" }} // Center button on mobile
          >
            <Button
              onClick={onReset}
              colorScheme="gray"
              variant="outline"
              w={{ base: "100%", md: "auto" }} // Full width button on mobile
            >
              Reset filter
            </Button>
          </Box>
        </Flex>

        {/* CoreTable will display responsively based on the columns passed */}
        <Box>
          <CoreTable
            onChangePage={onChangePage}
            columns={columns}
            paginationHidden={dataTable.length < 1}
            data={dataTable}
            onChangePageSize={onChangePageSize}
            totalPages={totalPages}
            page={pageNumber}
            size={pageSize}
            isLoading={isLoading}
            onRowClick={(id) => {
              if (userRole === "admin") {
                navigate(`/order-admin/detail/${id}`);
              } else {
                navigate(`/order/${id}`);
              }
            }}
          />
        </Box>
      </Box>

      {/* Dialog xác nhận thay đổi trạng thái - chỉ hiển thị cho admin */}
      {userRole === "admin" && (
        <StatusChangeDialog
          isOpen={isDialogOpen}
          onClose={onCancelStatusChange}
          onConfirm={onConfirmStatusChange}
          order={selectedOrder}
          newStatus={newStatus}
        />
      )}
    </Container>
  );
};

ListOrder.propTypes = {
  userRole: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default ListOrder;
