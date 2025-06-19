import { useContext, useEffect, useState } from "react";
import {
  Box,
  Image,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { UserContext } from "../../../Contexts/UserContext";
import { useQueryProductsList } from "../../../services/customers/products";
import { Checkbox, Empty } from "antd";
import useDetailProduct from "../../admin/products/detail/useDetail";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../../../components/Home/ProductList";

 const ProductPage = () => {
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


  if (isLoading) {
    return (
      <Image
        m="auto"
        mt="150px"
        src="https://media.tenor.com/BtC0jVjzYToAAAAM/loading-chain.gif"
      />
    );
  }

  return (
    <div className="flex gap-2">
      {/* Phần danh mục sản phẩm */}
      <Box w="20%" display="flex" flexDirection="column" p={4} gap={2}>
        <Heading as="h3" size="md" mb={4}>
          Danh mục sản phẩm
        </Heading>
        <Stack spacing={3}>
          {dataCategory?.items?.map((category) => (
            <Checkbox
              key={category.id}
              checked={selectCategory.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Checkbox>
          ))}
        </Stack>
      </Box>

      {/* Phần danh sách sản phẩm */}
      {(data?.items ?? []).length !== 0 ? (
        <Box
          w="80%"
          mx="auto"
          display="grid"
          gridTemplateColumns={["1fr", "1fr 1fr", "repeat(4, 1fr)"]}
          p={4}
          gap={6}
        >
          {data?.items.map((el, index) => (
            <ProductCard key={el.id ?? index} product={el} />
          ))}
        </Box>
      ) : (
        <Empty description={<span>Không có sản phẩm nào</span>} />
      )}
    </div>
  );
};

export default ProductPage;