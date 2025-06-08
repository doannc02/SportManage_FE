import { useState } from 'react';
import { useQueryProductsList } from '../../services/customers/products';
import { Box, Button, Heading, Skeleton as ChakraSkeleton, SimpleGrid, Text } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../configs/auth';

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    return (
        <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            _hover={{ boxShadow: 'lg' }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <Box height="200px" overflow="hidden" borderRadius="md" mb={2}>
                <img
                    src={`${BASE_URL}${product?.images?.[0]}` || '/placeholder.png'}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                    style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
            </Box>
            <Box p={3}>
                <Heading size="md" isTruncated mb={2}>
                    {product.name}
                </Heading>
                <Text fontSize="sm" color="gray.500" noOfLines={2} mb={2}>
                    {product.description || <span className="text-gray-400 text-[11px] italic">{`Chưa có mô tả nào`}</span>}
                </Text>
                {product.variants?.[0] && (
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        {product.variants[0].price.toLocaleString()} ₫
                    </Text>
                )}
            </Box>
        </Box>
    );
};

const PagingControls = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={3} mt={8}>
            <Button
                leftIcon={<ArrowBackIcon />}
                onClick={() => onPageChange(currentPage - 1)}
                isDisabled={currentPage === 0}
                variant="outline"
            >
                Trang trước
            </Button>
            <Text fontSize="sm">
                Trang <strong>{currentPage + 1}</strong> / {totalPages}
            </Text>
            <Button
                rightIcon={<ArrowForwardIcon />}
                onClick={() => onPageChange(currentPage + 1)}
                isDisabled={currentPage + 1 >= totalPages}
                variant="outline"
            >
                Trang sau
            </Button>
        </Box>
    );
};

const ProductList = () => {
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useQueryProductsList({
        pageNumber: page,
        pageSize: 20
    });

    return (
        <Box
            py={8}
            mt={6}
        >
            <Heading
                as="h1"
                size="lg"
                mb={8}
                textAlign="center"
                letterSpacing="wide"
                color="blue.700"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
            >
                <span role="img" aria-label="shop">🛒</span>
                Danh sách sản phẩm
            </Heading>

            {isError && (
                <Box textAlign="center" mb={4}>
                    <Text color="red.500" fontWeight="semibold">
                        <span role="img" aria-label="error">❌</span> Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
                    </Text>
                </Box>
            )}

            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={7} mb={6}>
                {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <ChakraSkeleton key={i} height="260px" borderRadius="lg" />
                    ))
                    : data?.items?.length
                        ? data.items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                        : (
                            <Box gridColumn="1/-1" textAlign="center" py={10}>
                                <Text color="gray.400" fontSize="lg">
                                    <span role="img" aria-label="empty">🛒</span> Không có sản phẩm nào.
                                </Text>
                            </Box>
                        )
                }
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



export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
};



export const Skeleton = ({ className = '' }) => {
    return (
        <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
    );
};
