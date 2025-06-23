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

  const [isSmallerThanMd] = useMediaQuery("(max-width: 768px)"); // True if screen is md or smaller (tablet/mobile)
  const [isSmallerThanSm] = useMediaQuery("(max-width: 480px)"); // True if screen is sm or smaller (mobile)

  // Memoize responsive columns to avoid unnecessary re-renders
  const responsiveColumns = useMemo(() => {
    // Define which columns to show/hide based on screen size
    // Adjust these 'accessorKey' values to match your actual column definitions
    if (isSmallerThanSm) {
      // For very small screens (e.g., mobile portrait), show only essential info
      return columns.filter(
        (col) =>
          col.accessorKey === "code" || // Mã đơn hàng
          col.accessorKey === "totalAmount" || // Tổng tiền
          col.accessorKey === "state" || // Trạng thái
          col.accessorKey === "actions" // Các hành động (xem chi tiết, đổi trạng thái)
      );
    } else if (isSmallerThanMd) {
      // For medium screens (e.g., tablets), show a bit more
      return columns.filter(
        (col) =>
          col.accessorKey === "code" ||
          col.accessorKey === "customerName" || // Tên khách hàng (nếu có)
          col.accessorKey === "totalAmount" ||
          col.accessorKey === "createdAt" || // Ngày tạo
          col.accessorKey === "state" ||
          col.accessorKey === "actions"
      );
    }
    return columns; // Full columns for larger screens
  }, [columns, isSmallerThanMd, isSmallerThanSm]);

  return (
    <Container maxW={{ base: "100%", md: "100%", lg: "100%" }}>
      {userRole === "user" && (
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          p={{ base: 4, md: 6 }} // Adjust padding
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
            fontSize={{ base: "sm", md: "md" }} // Adjust font size
            mt={4} // Added margin-top for better spacing
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
        // Adjusted padding for better fit on all screens
        px={{ base: 4, md: 8, lg: 10 }}
        py={{ base: 6, md: 8 }}
        mb={6}
      >
        {/* Filter section: Stack vertically on small screens, horizontally on medium and up */}
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
            columns={responsiveColumns}
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
