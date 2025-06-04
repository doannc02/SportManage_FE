import {
  Grid,
  GridItem,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Alert,
  AlertIcon,
  Box,
  Badge,
} from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import CoreTable from "../../../../components/atoms/CoreTable";
import { Button, Tooltip } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import { useQueryUserList } from "../../../../services/admins/users";

const defaultValues = {
  pageNumber: 0,
  pageSize: 20,
  keyword: "",
};

const AddressDetail = ({ shippingAddresses }) => (
  <Box p={3} borderRadius="md" boxShadow="lg" bg="white">
    <Text fontSize="md" fontWeight="semibold" mb={3} pb={2} borderBottom="1px solid" borderColor="gray.200">
      Danh sách địa chỉ giao hàng
    </Text>
    {shippingAddresses?.length > 0 ? (
      shippingAddresses.map((shipAddr, idx) => (
        <Box
          key={shipAddr.id}
          p={4}
          mb={3}
          border="1px solid"
          borderColor={shipAddr.isDefault ? "blue.200" : "gray.200"}
          borderRadius="md"
          bg={shipAddr.isDefault ? "blue.50" : "white"}
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="bold" color="gray.800">
              Địa chỉ {idx + 1}
            </Text>
            {shipAddr.isDefault && (
              <Badge colorScheme="blue" fontSize="xs" px={2} py={1} borderRadius="full">
                Mặc định
              </Badge>
            )}
          </Flex>
          <Box pl={3} borderLeft="2px solid" borderColor={shipAddr.isDefault ? "blue.400" : "gray.200"}>
            {[
              { label: "Địa chỉ", value: shipAddr.addressLine },
              { label: "Phường", value: shipAddr.ward },
              { label: "Quận", value: shipAddr.district },
              { label: "TP/Tỉnh", value: shipAddr.city },
              { label: "Quốc gia", value: shipAddr.country },
            ].map(({ label, value }) => (
              <Text key={label} fontSize="sm" mb={1} display="flex" alignItems="center">
                <Box as="span" fontWeight="medium" minW="80px" color="gray.600">{label}:</Box>
                <Box as="span" fontWeight="medium" minW="80px" color="green.600">{value}</Box>
              </Text>
            ))}
          </Box>
        </Box>
      ))
    ) : (
      <Flex direction="column" alignItems="center" justifyContent="center" py={6} bg="gray.50" borderRadius="md">
        <Box as="span" fontSize="2xl" mb={2} color="gray.400">📭</Box>
        <Text color="gray.500" fontStyle="italic">Không có địa chỉ giao hàng</Text>
      </Flex>
    )}
  </Box>
);

const UserListAdmin = () => {
  const methodForm = useForm({ defaultValues });
  const keyword = methodForm.watch("keyword");
  const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: null, name: null });
  const navigate = useNavigate();

  // Debounce keyword search
  useEffect(() => {
    const debounceFn = _.debounce((kw) => {
      setQueryPage((prev) => ({
        ...prev,
        keyword: kw,
        pageNumber: 0,
      }));
    }, 2000);
    debounceFn(keyword);
    return () => debounceFn.cancel();
  }, [keyword]);

  const onChangePageSize = useCallback((val) => {
    setQueryPage((prev) => ({
      ...prev,
      pageSize: val.pageSize,
      pageNumber: val.pageNumber,
    }));
  }, []);

  const onChangePage = useCallback((val) => {
    setQueryPage((prev) => ({
      ...prev,
      pageNumber: val,
    }));
  }, []);

  const handleOpenDialog = useCallback((userId, name) => {
    setSelectedUser({ id: userId, name });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedUser({ id: null, name: null });
  }, []);

  const handleConfirmDelete = async () => {
    try {
      // await deleteProduct({ id: selectedUser.id });
      toast.success(`Xóa user "${selectedUser.name}" thành công!`);
      handleCloseDialog();
      refetch();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Xảy ra lỗi không xác định khi xóa user.";
      toast.error(`Không thể xoá user: ${errorMessage}`);
      console.error("Xoá user thất bại:", err);
    }
  };

  const columns = useMemo(
    () => [
      { header: "Tên hệ thống", fieldName: "username", styleCell: { style: { minWidth: 250 } } },
      { header: "Email", fieldName: "email" },
      { header: "SDT", fieldName: "phone" },
      { header: "Giới tính", fieldName: "gender" },
      { header: "Tuổi", fieldName: "age" },
      { header: "Địa chỉ nhận hàng", fieldName: "shipAddresses" },
      { header: "Action", fieldName: "action" },
    ],
    []
  );

  const { data, isLoading, refetch } = useQueryUserList({ ...queryPage });

  const renderShipAddresses = (item) => (
    <Tooltip
      title={<AddressDetail shippingAddresses={item.shippingAddresses} />}
      arrow
      placement="top-start"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "white",
            '& .MuiTooltip-arrow': { color: "white" },
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            p: 0,
            borderRadius: "8px",
            overflow: "hidden"
          }
        }
      }}
    >
      <span
        style={{
          color: "#2563eb",
          textDecoration: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.9rem",
          fontWeight: 500,
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          transition: "all 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "rgba(37, 99, 235, 0.15)"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "rgba(37, 99, 235, 0.1)"}
      >
        <Box as="span" mr={1} fontSize="0.75rem">📍</Box>
        {item.shippingAddresses?.length || 0} địa chỉ
      </span>
    </Tooltip>
  );

  const dataTable = (data?.items ?? []).map((item) => ({
    ...item,
    username: item.user.username,
    email: item.user.email,
    shipAddresses: renderShipAddresses(item),
    action: (
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleOpenDialog(item.id, item.name)}
      >
        Xóa
      </Button>
    ),
  }));

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
      <GridItem colSpan={12}>
        <Flex justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/users/add")}
          >
            Thêm mới
          </Button>
        </Flex>
      </GridItem>
      <GridItem colSpan={[12, 6, 3]}>
        <CoreInput
          control={methodForm.control}
          name="keyword"
          label="Tìm kiếm"
          placeholder="Nhập tên hoặc mã user"
        />
      </GridItem>
      <GridItem colSpan={12} mt={4}>
        <CoreTable
          onChangePage={onChangePage}
          columns={columns}
          paginationHidden={dataTable.length < 1}
          data={dataTable}
          onChangePageSize={onChangePageSize}
          totalPages={data?.totalPages || 0}
          page={queryPage.pageNumber || 0}
          size={queryPage.pageSize || 20}
          isLoading={isLoading}
          onRowClick={id => navigate(`/users/detail/${id}`)}
        />
      </GridItem>
      <Modal isOpen={openDialog} onClose={handleCloseDialog} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xoá user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontWeight="bold" color="red.500">
                Cảnh báo: Khi xóa, bạn sẽ không thể khôi phục user và tất cả các biến thể đi kèm!
              </Text>
            </Alert>
            <Text>
              Bạn có chắc chắn muốn xoá user <strong>{selectedUser.name}</strong> này không?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseDialog} variant="outline" mr={3}>
              Huỷ
            </Button>
            <Button colorScheme="red" onClick={handleConfirmDelete}>
              Xoá
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default UserListAdmin;
