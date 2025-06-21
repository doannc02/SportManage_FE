import { useContext, useEffect, useState } from "react";
import { Box, Image, Heading, Stack } from "@chakra-ui/react";
import { UserContext } from "../../../Contexts/UserContext";
import { useQueryProductsList } from "../../../services/customers/products";
import { Checkbox, Divider, Empty, Spin } from "antd";
import useDetailProduct from "../../admin/products/detail/useDetail";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductCard } from "../../../components/Home/ProductList";
import { ArrowLeft } from "lucide-react";

const ProductPage = () => {
  const navigate = useNavigate();
  const { search } = useContext(UserContext);
  const [selectCategory, setSelectCategory] = useState([]);
  const [{ dataCategory }] = useDetailProduct();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryValue = queryParams.get("category");

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
  }, [categoryValue]); // Thêm dependency categoryValue

  // Sửa lại cách gọi API
  const { data, isLoading } = useQueryProductsList({
    pageNumber: 0,
    pageSize: 20,
    keyword: search || undefined, // Truyền undefined nếu search rỗng
    categoryIds: selectCategory.length > 0 ? selectCategory : undefined, // Chỉ truyền khi có category được chọn
  });

  // if (isLoading) {
  //   return (
  //     <Image
  //       m="auto"
  //       mt="150px"
  //       src="https://media.tenor.com/BtC0jVjzYToAAAAM/loading-chain.gif"
  //     />
  //   );
  // }

  return (
    <>
      <Box my={2}>
        <Heading
          size="base"
          gap={2}
          display="flex"
          alignItems="center"
          ps={2}
          pt={2}
          onClick={() => navigate("/")}
          cursor={"pointer"}
        >
          <ArrowLeft />
          Trở về trang chủ
        </Heading>
        <Divider />
      </Box>
      <div className="md:flex-row flex flex-col gap-2">
        {/* Phần danh mục sản phẩm */}
        <Box
          w={{ base: "100%", md: "20%" }}
          display="flex"
          flexDirection="column"
          p={4}
          gap={2}
        >
          <Heading
            as="h3"
            size="md"
            mb={4}
            textAlign={{ base: "center", md: "left" }}
          >
            Danh mục sản phẩm
          </Heading>
          <Stack spacing={3}>
            <div className="grid grid-cols-2 md:grid-cols-1">
              {dataCategory?.items?.map((category) => (
                <Checkbox
                  key={category.id}
                  checked={selectCategory.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Checkbox>
              ))}
            </div>
          </Stack>
        </Box>
        <Spin spinning={isLoading}>
          {/* Phần danh sách sản phẩm */}
          {(data?.items ?? []).length !== 0 ? (
            <Box
              w="80%"
              mx="auto"
              display="grid"
              alignItems={"center"}
              gridTemplateColumns={["1fr", "1fr 1fr", "repeat(4, 1fr)"]}
              p={4}
              gap={6}
            >
              {data?.items.map((el, index) => (
                <ProductCard key={el.id ?? index} product={el} />
              ))}
            </Box>
          ) : (
            <Box
              w="80%"
              minH="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
              gap={6}
            >
              <Empty description={<span>Không có sản phẩm nào</span>} />
            </Box>
          )}
        </Spin>
      </div>
    </>
  );
};

export default ProductPage;
