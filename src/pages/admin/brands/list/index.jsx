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
  deleteBrand,
  useQueryBrandsList,
} from "../../../../services/admins/brands";
import { countiesCitiesEnums } from "../../../../const/enum";

const defaultValues = {
  pageNumber: 0,
  pageSize: 20,
  keyword: "",
};

const BrandListAdmin = () => {
  const methodForm = useForm({ defaultValues });
  const keyword = methodForm.watch("keyword");
  const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState({ id: null, name: null });
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

  const handleOpenDialog = useCallback((brandId, name) => {
    setSelectedBrand({ id: brandId, name });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedBrand({ id: null, name: null });
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await deleteBrand({ id: selectedBrand.id });
      toast.success(`Xoá thương hiệu "${selectedBrand.name}" thành công!`);
      handleCloseDialog();
      refetch();
    } catch (err) {
      toast.error("Không thể xoá thương hiệu: " + (err?.message || ""));
    }
  };

  const columns = useMemo(
    () => [
      { header: "Tên thương hiệu", fieldName: "name" },
      { header: "Slug", fieldName: "slug" },
      { header: "Quốc gia", fieldName: "countryId" },
      { header: "Thành phố", fieldName: "city" },
      { header: "Năm thành lập", fieldName: "foundedYear" },
      { header: "Website", fieldName: "website" },
      { header: "Trạng thái", fieldName: "isActive" },
      { header: "Action", fieldName: "action" },
    ],
    []
  );

  const { data, isLoading, refetch } = useQueryBrandsList(queryPage);

  const dataTable = (data?.items ?? []).map((item) => ({
    ...item,
    foundedYear: item?.foundedYear?.toString(),
    countryId:
      countiesCitiesEnums.find((i) => i.value === item?.countryId)?.label || "",
    city: (() => {
      // Tìm country chứa cities
      const countryWithCities = countiesCitiesEnums.find(
        (c) =>
          Array.isArray(c.cities) &&
          c.cities.some((city) => city.value === item.city)
      );
      if (countryWithCities) {
        const cityObj = countryWithCities.cities.find(
          (city) => city.value === item.city
        );
        return cityObj ? cityObj.label : item.city;
      }
      return item.city;
    })(),
    isActive: item.isActive ? "Đang hoạt động" : "Ngưng hoạt động",
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
          <Button variant="contained" onClick={() => navigate("/brands/add")}>
            Thêm mới
          </Button>
        </Flex>
      </GridItem>

      <GridItem colSpan={[12, 6, 3]}>
        <CoreInput
          control={methodForm.control}
          name="keyword"
          label="Tìm kiếm"
          placeholder="Nhập tên thương hiệu"
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
          onRowClick={(id) => navigate(`/brands/detail/${id}`)}
        />
      </GridItem>

      <Modal isOpen={openDialog} onClose={handleCloseDialog} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xoá thương hiệu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontWeight="bold" color="red.500">
                Cảnh báo: Dữ liệu đã xoá sẽ không thể khôi phục!
              </Text>
            </Alert>
            <Text>
              Bạn có chắc chắn muốn xoá thương hiệu{" "}
              <strong>{selectedBrand.name}</strong> không?
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

export default BrandListAdmin;
