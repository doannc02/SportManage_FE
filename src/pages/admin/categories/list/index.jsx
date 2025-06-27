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
  Avatar,
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
  deleteCategory,
  useQueryCategoryList,
} from "../../../../services/admins/categories";

const defaultValues = {
  pageNumber: 0,
  pageSize: 20,
  keyword: "",
};

const CategoryListAdmin = () => {
  const methodForm = useForm({ defaultValues });
  const keyword = methodForm.watch("keyword");
  const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: null,
    name: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const debounceFn = _.debounce((kw) => {
      setQueryPage((prev) => ({
        ...prev,
        keyword: kw,
        // pageNumber: 0,
      }));
    }, 800);
    debounceFn(keyword);
    return () => debounceFn.cancel();
  }, [keyword]);

  const onChangePageSize = useCallback((val) => {
    setQueryPage((prev) => ({
      ...prev,
      pageSize: val.pageSize,
      pageNumber: val.pageNumber - 1,
    }));
  }, []);

  const onChangePage = useCallback((event,val) => {
    setQueryPage((prev) => ({
      ...prev,
      pageNumber: val - 1,
    }));
  }, []);

  // const onReset = useCallback(() => {
  //   methodForm.reset(defaultValues);
  //   setQueryPage(_.omitBy(defaultValues, _.isNil));
  // }, [methodForm]);

  const handleOpenDialog = useCallback((categoryId, name) => {
    setSelectedCategory({ id: categoryId, name });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedCategory({ id: null, name: null });
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory({ id: selectedCategory.id });
      toast.success(`Xoá danh mục "${selectedCategory.name}" thành công!`);
      handleCloseDialog();
      refetch();
    } catch (err) {
      toast.error("Không thể xoá danh mục: " + (err?.message || ""));
    }
  };

  const columns = useMemo(
    () => [
      { header: "Tên danh mục", fieldName: "name" },
      { header: "Mô tả", fieldName: "description" },
      { header: "Logo", fieldName: "logo" },
      { header: "Ngày tạo", fieldName: "createdAt" },
      { header: "Action", fieldName: "action" },
    ],
    []
  );

  const { data, isLoading, refetch } = useQueryCategoryList(queryPage);

  const dataTable = (data?.items ?? []).map((item) => ({
    ...item,
    logo: item?.logo ? (
      <Avatar
        src={`${item.logo}`}
        size="xl"
        borderRadius="md"
        bg="gray.100"
      />
    ) : null,
    description: "",
    createdAt: new Date(item.createdAt).toLocaleString(),
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
            onClick={() => navigate("/categories/add")}
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
          placeholder="Nhập tên danh mục"
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
          onRowClick={(id) => navigate(`/categories/detail/${id}`)}
        />
      </GridItem>

      <Modal isOpen={openDialog} onClose={handleCloseDialog} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xoá danh mục</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontWeight="bold" color="red.500">
                Cảnh báo: Dữ liệu đã xoá sẽ không thể khôi phục!
              </Text>
            </Alert>
            <Text>
              Bạn có chắc chắn muốn xoá danh mục{" "}
              <strong>{selectedCategory.name}</strong> không?
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

export default CategoryListAdmin;
