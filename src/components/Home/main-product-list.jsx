import { useState, useEffect } from "react";
import { useQueryProductsVariantList } from "../../services/customers/products";
import {
  Box,
  Skeleton as ChakraSkeleton,
  SimpleGrid,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { ConfigProvider, Pagination, Popover } from "antd";
import { DEFAULT_COLOR } from "../../const/enum";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <Box
      width="100%"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      _hover={{
        "& .product-border": {
          borderColor: DEFAULT_COLOR,
          boxShadow: "lg",
        },
        "& .add-to-cart-overlay": {
          height: "40px",
          opacity: 1,
        },
      }}
      onClick={() => {
        navigate(`/product/${product.productId}`);
        localStorage.setItem("variant-id", product.id);
      }}
    >
      <Box
        className="product-border"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        transition="all 0.3s ease-in-out"
      >
        <Box height="200px" overflow="hidden" mb={2}>
          <img
            src={`${product?.images?.[0]}` || "/placeholder.png"}
            loading="lazy"
            alt={product?.name}
            style={{
              transition: "transform 0.3s ease",
              cursor: "pointer",
              height: "100%",
              objectFit: "cover",
              width: "100%",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Box>
        <Box p={{ base: "0 8px 12px", md: 3 }}>
          <Text fontSize="md" color="gray.600" isTruncated mb={2}>
            <Popover content={product?.name}>{product?.name}</Popover>
          </Text>
          {product?.variants?.[0] && (
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Text fontSize="md" fontWeight="bold" color={DEFAULT_COLOR}>
                ₫{product?.variants[0].price.toLocaleString()}
              </Text>
              <Flex justifyContent={"center"} alignItems={"center"}>
                <ShoppingCart size={16} color="#000000" strokeWidth={1} />
                <Text ml={1} fontSize="sm" color="gray.600">
                  {product?.variants[0]?.stockQuantity || 0}
                </Text>
              </Flex>
            </Flex>
          )}
          <Text fontSize="sm" color="gray.500" noOfLines={1} mt={1}>
            {product?.reviews ? product.reviews.length : 0} lượt đánh giá
          </Text>
        </Box>
      </Box>

      <Flex
        className="add-to-cart-overlay"
        position="absolute"
        bottom="0"
        left="0"
        width="100%"
        height="0"
        bg={DEFAULT_COLOR}
        color="white"
        justifyContent="center"
        alignItems="center"
        opacity="0"
        transition="all 0.3s ease-in-out"
        fontWeight="bold"
        fontSize="sm"
      >
        Thêm vào giỏ hàng
      </Flex>
    </Box>
  );
};

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(window.innerWidth < 768 ? 6 : 24);
  const { data, isLoading, isError } = useQueryProductsVariantList({
    pageNumber: page,
    pageSize: pageSize,
  });
  localStorage.removeItem("variant-id");
  const handleChange = (currentPage) => {
    setPage(currentPage);
  };
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 768 ? 6 : 24);
      setPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box py={8} my={6} w={"100%"}>
      {/* Đây là Box container chính, sẽ quyết định width và padding chung */}
      <Box
        width={"100%"}
        mx="auto" // Căn giữa
        px={{ base: 4, md: 8 }} // <-- Điều chỉnh padding cho toàn bộ khu vực này. md: 8 (32px) là một giá trị khá phổ biến.
      >
        <Text
          textTransform="uppercase"
          className="mb-4"
          textColor={"#787877"}
          textAlign={{ base: "left", md: "left" }}
          mb={4}
          gap={2}
          // px={{ base: 0, md: 0 }} // <-- Xóa padding ở đây để nó căn lề theo Box cha mới
        >
          Danh sách sản phẩm
        </Text>

        {isError && (
          <Box textAlign="center" mb={4}>
            <Text color="red.500" fontWeight="semibold">
              <span role="img" aria-label="error">
                ❌
              </span>{" "}
              Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
            </Text>
          </Box>
        )}

        <Box bg="white" borderRadius="md" p={{ base: 0, md: 0 }}>
          <SimpleGrid
            columns={{ base: 2, md: 4, lg: 6 }}
            spacing={{ base: 4, md: 4 }} // Đảm bảo khoảng cách giữa các item là nhất quán
            mb={6}
            px={0} // <-- Rất quan trọng: Bỏ padding của SimpleGrid để nó lấp đầy không gian của Box cha
            width="100%" // Đảm bảo chiếm 100% chiều rộng của Box cha đã được padding
          >
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <ChakraSkeleton key={i} height="260px" borderRadius="lg" />
              ))
            ) : data?.items?.length ? (
              data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <Box gridColumn="1/-1" textAlign="center" py={10}>
                <Text color="gray.400" fontSize="lg">
                  <span role="img" aria-label="empty">
                    🛒
                  </span>{" "}
                  Không có sản phẩm nào.
                </Text>
              </Box>
            )}
          </SimpleGrid>
        </Box>
      </Box>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#319795",
          },
        }}
      >
        <Pagination
          align="center"
          current={page}
          total={data?.totalCount}
          pageSize={pageSize}
          onChange={handleChange}
        />
      </ConfigProvider>
    </Box>
  );
};

export default ProductList;

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const Skeleton = ({ className = "" }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
  );
};
