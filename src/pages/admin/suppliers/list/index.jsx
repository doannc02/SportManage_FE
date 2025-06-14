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
} from "@chakra-ui/react";
import CoreInput from "../../../../components/atoms/CoreInput";
import CoreTable from "../../../../components/atoms/CoreTable";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import {
  deleteSupplier,
  useQuerySuppliersList,
} from "../../../../services/admins/suppliers";
import { countiesCitiesEnums } from "../../../../const/enum";

const defaultValues = {
  pageNumber: 0,
  pageSize: 20,
  keyword: "",
};

const SupplierListAdmin = () => {
  const methodForm = useForm({ defaultValues });
  const keyword = methodForm.watch("keyword");
  const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState({
    id: null,
    name: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const debounceFn = _.debounce((kw) => {
      setQueryPage((prev) => ({
        ...prev,
        keyword: kw,
        pageNumber: 0,
      }));
    }, 800);
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

  const onReset = useCallback(() => {
    methodForm.reset(defaultValues);
    setQueryPage(_.omitBy(defaultValues, _.isNil));
  }, [methodForm]);

  const handleOpenDialog = useCallback((id, name) => {
    setSelectedSupplier({ id, name });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedSupplier({ id: null, name: null });
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier({ id: selectedSupplier.id });
      toast.success(`Xoá nhà cung cấp "${selectedSupplier.name}" thành công!`);
      handleCloseDialog();
      refetch();
    } catch (err) {
      toast.error("Không thể xoá nhà cung cấp: " + (err?.message || ""));
    }
  };

  const columns = useMemo(
    () => [
      { header: "Tên", fieldName: "name" },
      { header: "Email", fieldName: "contactEmail" },
      { header: "Điện thoại", fieldName: "contactPhone" },
      { header: "Quốc gia", fieldName: "country" },
      { header: "Ngày tạo", fieldName: "createdAt" },
      { header: "Action", fieldName: "action" },
    ],
    []
  );

  const { data, isLoading, refetch } = useQuerySuppliersList(queryPage);

  const dataTable = (data?.items ?? []).map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt).toLocaleString(),
    country:
      countiesCitiesEnums.find((i) => i.value === item?.country)?.label ||
      item?.countryId,

    action: (
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleOpenDialog(item.id, item.name)}
      >
        Xoá
      </Button>
    ),
  }));

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
      <GridItem colSpan={12}>
        <Flex justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/suppliers/add")}
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
          placeholder="Nhập tên nhà cung cấp"
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
          onRowClick={(id) => navigate(`/suppliers/detail/${id}`)}
        />
      </GridItem>

      <Modal isOpen={openDialog} onClose={handleCloseDialog} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xoá nhà cung cấp</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontWeight="bold" color="red.500">
                Cảnh báo: Dữ liệu đã xoá sẽ không thể khôi phục!
              </Text>
            </Alert>
            <Text>
              Bạn có chắc chắn muốn xoá nhà cung cấp{" "}
              <strong>{selectedSupplier.name}</strong> không?
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

export default SupplierListAdmin;
