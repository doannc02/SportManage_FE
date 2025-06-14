import { useContext, useEffect, useState } from "react";
import {
  Box,
  chakra,
  Text,
  Image,
  Heading,
  Center,
  HStack,
  Icon,
  Tooltip,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { UserContext } from "../../../Contexts/UserContext";
import { useQueryProductsList } from "../../../services/customers/products";
import { BASE_URL } from "../../../configs/auth";
import { Checkbox, Empty } from "antd";
import useDetailProduct from "../../admin/products/detail/useDetail";
import { useLocation, useNavigate } from "react-router-dom";

const ProductPage = () => {
  const navigate = useNavigate();
  const { search } = useContext(UserContext);
  const [noofElements] = useState(10);
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

  const slice = data?.items?.slice(0, noofElements);

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
      {(slice ?? []).length !== 0 ? (
        <Box
          w="80%"
          mx="auto"
          display="grid"
          gridTemplateColumns={["1fr", "1fr 1fr", "repeat(4, 1fr)"]}
          p={4}
          gap={6}
        >
          {slice.map((el, index) => (
            <ProductItem key={el.id} el={el} navigate={navigate} />
          ))}
        </Box>
      ) : (
        <Empty description={<span>Không có sản phẩm nào</span>} />
      )}
    </div>
  );
};

// Tách component riêng cho mỗi sản phẩm
const ProductItem = ({ el, navigate }) => (
  <Center py={4}>
    <Box
      w="100%"
      bg="white"
      rounded="xl"
      shadow="md"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
      position="relative"
      onClick={() => navigate(`/product/${el.id}`)}
    >
      {el.quantity < 1 && (
        <Alert status="error" roundedTop="xl">
          <AlertIcon />
          <AlertTitle>Out Of Stock!</AlertTitle>
        </Alert>
      )}

      <Box cursor="pointer">
        <Image
          boxSize="270px"
          mx="auto"
          src={`${BASE_URL}${el?.images?.[0]}` || "/placeholder.png"}
          alt={el.name}
          objectFit="contain"
          p={3}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/270";
            e.onError = null;
          }}
        />
      </Box>

      <Box p={4}>
        <Heading as="h3" fontSize="md" fontWeight="semibold" noOfLines={2} mb={1}>
          {el.name}
        </Heading>

        <Text fontSize="sm" color="gray.600" mb={2}>
          Thương hiệu: {el?.brand?.name || "New Brand"}
        </Text>

        <Text fontSize="xl" fontWeight="bold" color="cyan.600" textAlign="center" mb={3}>
          {el?.variants[0]?.price?.toLocaleString() ?? "0"} ₫
        </Text>

        <HStack
          p={2}
          justify="center"
          bg="black"
          color="white"
          borderRadius="md"
          _hover={{ bg: "cyan.500" }}
          cursor="pointer"
        >
          <Tooltip label="Add to cart" bg="white" placement="top" color="black" fontSize="md">
            <chakra.a>
              <HStack spacing={2}>
                <Icon as={FiShoppingCart} h={6} w={6} />
                <Text fontSize="md" fontWeight="bold">
                  QUICKBUY
                </Text>
              </HStack>
            </chakra.a>
          </Tooltip>
        </HStack>
      </Box>
    </Box>
  </Center>
);

export default ProductPage;