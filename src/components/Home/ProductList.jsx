import { useState } from "react";
import { useQueryProductsList } from "../../services/customers/products";
import {
  Box,
  Button,
  Skeleton as ChakraSkeleton,
  SimpleGrid,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../configs/auth";
import {
  ShoppingCart,
} from "lucide-react";
import { useEffect } from "react";

export const ProductCard = ({ product }) => {

  const navigate = useNavigate();
  return (
    <Box
      // maxW="180px"
      borderWidth="1px"
      overflow="hidden"
      cursor="pointer"
      _hover={{ boxShadow: "lg" }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <Box height="250px" overflow="hidden" mb={2}>
        <img
          src={`${product?.images?.[0]}` || "/placeholder.png"}
          alt={product?.name}
          style={{
            transition: "transform 0.3s ease",
            cursor: "pointer",
            height: "100%",
            objectFit: "cover",
            width: "100%",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </Box>
      <Box p={3}>
        <Text fontSize="md" color="gray.600" noOfLines={2} mb={2}>
          {product?.name}
        </Text>
        {product?.variants?.[0] && (
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize="md" fontWeight="bold" color="blue.600">
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
  );
};

const PagingControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 2) pages.push(0, "...");
      else for (let i = 0; i < Math.min(3, totalPages); i++) pages.push(i);

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 3) pages.push("...", totalPages - 1);
      else
        for (let i = totalPages - 3; i < totalPages; i++)
          if (i > 1) pages.push(i);
    }
    return pages;
  };

  return (
    <Flex justify="center" align="center" gap={2} mt={8}>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 0}
        variant="outline"
      >
        Quay về
      </Button>
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <Text key={idx} px={2} color="gray.400" fontSize="md">
            ...
          </Text>
        ) : (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "solid" : "ghost"}
            colorScheme={page === currentPage ? "blue" : "gray"}
            onClick={() => onPageChange(page)}
            fontWeight={page === currentPage ? "bold" : "normal"}
            borderRadius="md"
            minW="32px"
          >
            {page + 1}
          </Button>
        )
      )}
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage + 1 >= totalPages}
        variant="outline"
      >
        Kế tiếp
      </Button>
    </Flex>
  );
};

const ProductList = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(window.innerWidth < 768 ? 2 : 6);
  const { data, isLoading, isError } = useQueryProductsList({
    pageNumber: page,
    pageSize: pageSize,
  });

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 768 ? 2 : 6);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Box py={8} my={6} bg={"white"} p={5} w={"100%"}>
      <Text
        textTransform="uppercase" 
        className="mb-4"
        textColor={"#787877"}
        textAlign={{base:"center", md:"left"}}
        mb={4}
        gap={2}
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

      <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={2} mb={6} px={7}>
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
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

      <PagingControls
        currentPage={page}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setPage}
      />
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
