import { useContext, useEffect, useState } from "react";
import { Box, Center, Heading, Image, Skeleton, Stack } from "@chakra-ui/react";
import { UserContext } from "../../../Contexts/UserContext";
import { useQueryProductsVariantList } from "../../../services/customers/products";
import { Checkbox, Divider, Empty } from "antd";
import useDetailProduct from "../../admin/products/detail/useDetail";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductCard } from "../../../components/Home/main-product-list";
import { ArrowLeft } from "lucide-react";

const ProductPage = () => {
  const navigate = useNavigate();
  const { search } = useContext(UserContext);
  const [selectCategory, setSelectCategory] = useState([]);
  const [{ dataCategory }] = useDetailProduct();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryValue = queryParams.get("category");
  console.log(search);

  const handleCategoryChange = (value) => {
    setSelectCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const getCategoryValue = () => {
    if (categoryValue) {
      setSelectCategory([categoryValue]);
    }
  };

  useEffect(() => {
    getCategoryValue();
  }, [categoryValue]);

  const { data, isLoading } = useQueryProductsVariantList({
    pageNumber: 1,
    pageSize: 20,
    keyword: search || undefined,
    categoryIds: selectCategory.length > 0 ? selectCategory : undefined,
  });

  return (
    <Box px={{ base: 0, md: 10 }}>
      <Box my={2}>
        <Heading
          size="base"
          gap={2}
          display="flex"
          alignItems="center"
          ps={2}
          pt={2}
          cursor={"pointer"}
        >
          <span className="flex items-center" onClick={() => navigate("/")}>
            <ArrowLeft />
            Trở về trang chủ
          </span>
        </Heading>
        <Divider />
      </Box>
      <Box
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        gap={2}
      >
        {/* Phần danh mục sản phẩm */}
        <Box
          w={{ base: "100%", md: "20%" }}
          display="flex"
          flexDirection="column"
          px={10}
          gap={2}
          borderRight={{ base: "none", md: "0.1px solid #d4d9d6" }}
        >
          <Heading
            as="h3"
            size="md"
            mb={4}
            textAlign={{ base: "center", md: "left" }}
          >
            Danh mục sản phẩm
          </Heading>
          <Heading
            size="sm"
            mb={4}
            textAlign={{ base: "center", md: "left" }}
          >
            Bỏ chọn tất cả 
          </Heading>
          
          <Stack spacing={3}>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {dataCategory?.items?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 w-full"
                >
                  <Image
                    boxSize="28px"
                    objectFit="cover"
                    borderRadius="md"
                    loading="lazy"
                    src={category.logo}
                    alt={category.name}
                    fallback={
                      <Center
                        boxSize="28px"
                        bg="gray.100"
                        borderRadius="md"
                      ></Center>
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <Checkbox
                      checked={selectCategory.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </Checkbox>
                  </div>
                </div>
              ))}
            </div>
          </Stack>
        </Box>
        {/* Phần danh sách sản phẩm */}
        <Box
          w="80%"
          mx="auto"
          display="grid"
          alignItems={"center"}
          gridTemplateColumns={["1fr", "1fr 1fr", "repeat(5, 1fr)"]}
          px={4}
          gap={6}
        >
          {isLoading ? (
            Array.from({ length: data?.items?.length || 10 }).map((_, idx) => (
              <Skeleton key={idx} height={{ base: "250px", md: "280px" }} />
            ))
          ) : (data?.items ?? []).length !== 0 ? (
            data.items.map((el, index) => (
              <ProductCard key={el.id ?? index} product={el} />
            ))
          ) : (
            <Box
              w="100%"
              minH="400px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
              gridColumn="1 / -1"
            >
              <Empty
                className="flex flex-col items-center justify-center w-full h-full"
                description={<span>Không có sản phẩm nào</span>}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductPage;
