import { useContext, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  HStack,
  Divider,
  useToast,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogHeader,
  Avatar,
  Spinner,
  Center,
  Textarea,
  useColorModeValue,
  IconButton,
  AspectRatio,
  Tag,
  FormControl,
} from "@chakra-ui/react";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ChatIcon,
} from "@chakra-ui/icons";
import {
  useQueryGetProductReview,
  useQueryProductsDetail,
} from "../../../../services/customers/products";
import { addToCartItem } from "../../../../services/customers/carts";
import {
  submitReview,
  submitReviewComment,
} from "../../../../services/customers/reviews";
import { useMutation } from "react-query";
import { UserContext } from "../../../../Contexts/UserContext";
import { getAppToken } from "../../../../configs/token";
import { BASE_URL } from "../../../../configs/auth";
import { ProductOffers } from "../../../../components/customer/product-detail/product-offers";
import { GroupedAttributeDisplay } from "../../../../components/customer/product-detail/product-group-attribute";
import { ReviewComment } from "../../../../components/products/review-comment";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { DEFAULT_COLOR } from "../../../../const/enum";

function buildCommentTree(comments) {
  // Nếu comments đã có cấu trúc cây (có thuộc tính replies),
  // thì chỉ cần lọc ra các comment gốc (parentCommentId is null)
  if (comments && comments.length > 0 && "replies" in comments[0]) {
    return comments.filter((comment) => comment.parentCommentId === null);
  }

  // Nếu comments là danh sách phẳng, thì xây dựng cây như cũ
  const map = {};
  const roots = [];

  // Tạo mapping cho mỗi comment
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, replies: [] };
  });

  // Sắp xếp comments để tạo cấu trúc cây
  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      if (map[comment.parentCommentId]) {
        map[comment.parentCommentId].replies.push(map[comment.id]);
      } else {
        // Nếu không tìm thấy comment cha (có thể do lỗi dữ liệu),
        // thêm vào danh sách gốc
        roots.push(map[comment.id]);
      }
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
}

// Product Review component - hiển thị đánh giá và các comment đa cấp
const ProductReview = ({ review, productId, onCommentAdded }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const toast = useToast();
  const tokenApp = getAppToken();
  const bgReview = useColorModeValue("gray.100", "gray.700");

  const { mutate: sendComment, isLoading: isSendingComment } = useMutation(
    submitReviewComment,
    {
      onSuccess: () => {
        toast({
          title: "Bình luận đã được gửi!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCommentContent("");
        setIsCommenting(false);
        if (onCommentAdded) onCommentAdded();
      },
      onError: () => {
        toast({
          title: "Lỗi khi gửi bình luận",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleSubmitComment = () => {
    if (!commentContent.trim()) {
      toast({
        title: "Vui lòng nhập nội dung bình luận",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    sendComment({
      reviewId: review.id,
      productId: productId,
      comment: commentContent,
    });
  };

  return (
    <Box p={4} borderWidth={1} rounded="md" bg={bgReview} mb={4}>
      <HStack spacing={4} align="start">
        <Avatar name={review.userName || "Khách hàng"} size="sm" />
        <Box w="full">
          <Text fontWeight="bold">{review.userName || "Khách hàng"}</Text>
          <HStack>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                color={i <= review.rating ? "yellow.400" : "gray.300"}
                boxSize={4}
              />
            ))}
          </HStack>
          <Text mt={1}>{review.comment}</Text>

          {/* Display review images if available */}
          {review.images && review.images.length > 0 && (
            <Flex mt={2} flexWrap="wrap" gap={2}>
              {review.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={`${img}`}
                  alt={`Review image ${idx + 1}`}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                />
              ))}
            </Flex>
          )}

          {/* Add comment button */}
          {tokenApp && (
            <Button
              leftIcon={<ChatIcon />}
              variant="ghost"
              size="sm"
              mt={2}
              onClick={() => setIsCommenting(!isCommenting)}
            >
              {isCommenting ? "Hủy bình luận" : "Thêm bình luận"}
            </Button>
          )}

          {/* Comment form */}
          {isCommenting && (
            <Box mt={2} p={3} borderWidth="1px" borderRadius="md">
              <FormControl>
                <Textarea
                  placeholder="Nhập bình luận của bạn..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  size="sm"
                />
              </FormControl>
              <HStack mt={2} justifyContent="flex-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCommenting(false)}
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  colorScheme="teal"
                  isLoading={isSendingComment}
                  onClick={handleSubmitComment}
                >
                  Gửi
                </Button>
              </HStack>
            </Box>
          )}

          {/* Display comments - Hoạt động với cả cấu trúc JSON đa cấp */}
          {review.comments && review.comments.length > 0 && (
            <Box mt={4}>
              <Text fontWeight="medium" mb={2}>
                Bình luận ({review.comments.length})
              </Text>
              <VStack spacing={2} align="stretch">
                {/* Dùng comments trực tiếp nếu đã là cấu trúc cây, hoặc buildCommentTree nếu là danh sách phẳng */}
                {buildCommentTree(review.comments).map((comment) => (
                  <ReviewComment
                    key={comment.id}
                    comment={comment}
                    productId={productId}
                    reviewId={review.id}
                    onCommentAdded={onCommentAdded}
                    depth={0} // Bắt đầu ở độ sâu 0 cho comment gốc
                  />
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );
};
const ProductDetails = () => {
  const tokenApp = getAppToken();
  const { setUser } = useContext(UserContext);
  const toast = useToast();
  const params = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const colorText = useColorModeValue("gray.900", "gray.400");
  // const bgVariant = useColorModeValue("gray.100", "gray.700");
  const thumbBg = useColorModeValue("white", "gray.800");

  const { data, isLoading } = useQueryProductsDetail(
    { id: params.id },
    { enabled: !!params?.id }
  );

  const {
    data: dataReviews,
    isLoading: isLoadingReview,
    refetch: refetchReview,
  } = useQueryGetProductReview({ id: params.id }, { enabled: !!params?.id });

  const { mutate: addToCart, isLoading: isAdding } = useMutation(
    addToCartItem,
    {
      onSuccess: (res) => {
        setUser((prev) => ({ ...prev, totalCartItems: res.totalCartItems }));
        toast({
          title: "Đã thêm vào giỏ hàng",
          description: `${selectedVariant.name} đã được thêm.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast({
          title: "Thêm vào giỏ hàng thất bại",
          description: err?.response?.data?.message || "Có lỗi xảy ra.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const { mutate: sendReview, isLoading: isSubmittingReview } = useMutation(
    submitReview,
    {
      onSuccess: () => {
        toast({
          title: "Cảm ơn bạn đã đánh giá!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refetchReview();
        setRating(0);
        setComment("");
      },
      onError: () => {
        toast({
          title: "Lỗi khi gửi đánh giá",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleVariantSelect = (variant) => {
    if (selectedVariant?.id === variant.id) {
      setQuantity((q) => Math.min(q + 1, variant.stockQuantity));
    } else {
      setSelectedVariant(variant);
      setQuantity(1);
      if (variant.images?.length) {
        setMainImage(`${variant.images[0]}`);
        setCurrentImageIndex(0);
      }
    }
  };

  const handleAddToCart = () => {
    if (!tokenApp) return onOpen();
    if (!selectedVariant)
      return toast({
        title: "Vui lòng chọn biến thể",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    if (quantity > selectedVariant.stockQuantity)
      return toast({
        title: "Vượt quá tồn kho",
        description: `Chỉ còn ${selectedVariant.stockQuantity} sản phẩm.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

    addToCart({ productVariantId: selectedVariant.id, quantity });
  };

  if (isLoading)
    return (
      <Center mt="150px">
        <Spinner size="xl" />
      </Center>
    );
  if (!data)
    return (
      <Center mt="150px">
        <Text>Không tìm thấy sản phẩm</Text>
      </Center>
    );

  const thumbnails = selectedVariant?.images?.length
    ? selectedVariant.images
    : data.images;

  const initialImage = mainImage || `${thumbnails?.[0]}`;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? thumbnails.length - 1 : prev - 1
    );
    setMainImage(
      `${
        thumbnails[
          currentImageIndex === 0
            ? thumbnails.length - 1
            : currentImageIndex - 1
        ]
      }`
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === thumbnails.length - 1 ? 0 : prev + 1
    );
    setMainImage(
      `${
        thumbnails[
          currentImageIndex === thumbnails.length - 1
            ? 0
            : currentImageIndex + 1
        ]
      }`
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    setMainImage(`${thumbnails[index]}`);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <Container maxW="6xl" py={10}>
      <Box mb={2}>
        <Heading size="lg" mb={2} display="flex" gap={2} alignItems="center">
          <ArrowLeft onClick={() => navigate(-1)}/>
          Chi tiết sản phẩm 
          <ShoppingBag  color={DEFAULT_COLOR}/>
        </Heading>
        <Divider />
      </Box>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Flex direction="column">
          {/* Image Gallery */}
          <Box position="relative" mb={4}>
            <AspectRatio ratio={1} maxH={{ base: "350px", md: "500px" }} mb={4}>
              <Box
                position="relative"
                overflow="hidden"
                borderRadius="md"
                onClick={toggleZoom}
                cursor="zoom-in"
              >
                <Image
                  src={initialImage}
                  alt={data.name}
                  objectFit="contain"
                  w="100%"
                  h="100%"
                  transition="transform 0.3s ease"
                />
              </Box>
            </AspectRatio>

            {/* Navigation arrows */}
            <IconButton
              aria-label="Previous image"
              icon={<ChevronLeftIcon boxSize={6} />}
              position="absolute"
              left="0"
              top="50%"
              transform="translateY(-50%)"
              colorScheme="blackAlpha"
              rounded="full"
              size="md"
              onClick={handlePrevImage}
              opacity="0.7"
              _hover={{ opacity: 1 }}
            />
            <IconButton
              aria-label="Next image"
              icon={<ChevronRightIcon boxSize={6} />}
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              colorScheme="blackAlpha"
              rounded="full"
              size="md"
              onClick={handleNextImage}
              opacity="0.7"
              _hover={{ opacity: 1 }}
            />

            {/* Current image indicator */}
            <HStack
              justify="center"
              spacing={1}
              position="absolute"
              bottom="2"
              left="0"
              right="0"
            >
              {thumbnails?.map((_, idx) => (
                <Box
                  key={idx}
                  w="2"
                  h="2"
                  borderRadius="full"
                  bg={currentImageIndex === idx ? "teal.500" : "gray.300"}
                />
              ))}
            </HStack>
          </Box>
          {/* Thumbnails */}
          <Flex overflowX="auto" pb={2} gap={2} justify="center">
            {thumbnails?.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                borderWidth={2}
                borderColor={
                  currentImageIndex === idx ? "teal.500" : "transparent"
                }
                borderRadius="md"
                p={1}
                bg={thumbBg}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: "teal.300" }}
                w="16"
                h="16"
              >
                <Image
                  src={`${img}`}
                  alt={`${data.name} thumbnail ${idx + 1}`}
                  objectFit="cover"
                  w="full"
                  h="full"
                  borderRadius="sm"
                />
              </Box>
            ))}
          </Flex>
          {/*Attribute*/}
          {selectedVariant && (
            <GroupedAttributeDisplay
              size={selectedVariant?.size}
              attribute={selectedVariant?.attribute ?? []}
              unit={selectedVariant?.unit}
              description={selectedVariant?.description}
            />
          )}
        </Flex>

        <Stack spacing={6}>
          <Box>
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>{data.name}</Heading>
            {(data?.productCategories ?? []).map((pr, index) => {
              const name = pr?.category?.name;
              return (
                <Tag
                  key={pr?.category?.id ?? index}
                  size="md"
                  colorScheme="teal"
                  borderRadius="md"
                  variant="outline"
                  mr={2}
                  mb={2}
                  mt={2}
                >
                  #{name}
                </Tag>
              );
            })}
            <Text color={colorText} fontWeight="bold" fontSize="2xl" mt={2}>
              {new Intl.NumberFormat("en-US").format(
                selectedVariant?.price ?? 0
              )}{" "}
              VND
            </Text>
          </Box>

          <Text fontSize="md" color="gray.500">
            {data.description}
          </Text>

          <Box>
            <Text fontWeight="bold" mb={2}>
              Chọn biến thể:
            </Text>
            <HStack wrap="wrap" spacing={4}>
              {data.variants.map((variant) => (
                <Button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  variant={
                    selectedVariant?.id === variant.id ? "solid" : "outline"
                  }
                  colorScheme="teal"
                  size={{ base: "sm", md: "md" }}
                  mb={2}
                >
                  {variant.name}
                </Button>
              ))}
            </HStack>
          </Box>

          <HStack>
            <Text fontWeight="bold">Số lượng:</Text>
            <Button
              onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
              size={{ base: "sm", md: "md" }}
              colorScheme="teal"
              variant="outline"
            >
              -
            </Button>
            <Box
              px={3}
              py={2}
              borderWidth={1}
              borderRadius="md"
              minW={10}
              textAlign="center"
            >
              {quantity}
            </Box>
            <Button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(q + 1, selectedVariant?.stockQuantity || 99)
                )
              }
              size={{ base: "sm", md: "md" }}
              colorScheme="teal"
              variant="outline"
            >
              +
            </Button>
            {selectedVariant?.stockQuantity && (
              <Text fontSize="sm" color="gray.500" ml={2}>
                Còn {selectedVariant.stockQuantity} sản phẩm
              </Text>
            )}
          </HStack>

          <Button
            colorScheme="teal"
            onClick={handleAddToCart}
            isLoading={isAdding}
            size="lg"
            mt={2}
            leftIcon={<i className="fa fa-shopping-cart" />}
          >
            Thêm vào giỏ hàng
          </Button>
          <ProductOffers />
        </Stack>
      </SimpleGrid>

      {/* Product Reviews Section */}
      <Box mt={10}>
        <Heading size="lg" mb={5}>
          Đánh giá sản phẩm
        </Heading>
        <Divider mb={5} />

        {/* Add Review Section */}
        <Box mb={8}>
          {!tokenApp ? (
            <Text color="red.500">
              Vui lòng{" "}
              <Button
                variant="link"
                colorScheme="teal"
                onClick={() => navigate("/login")}
              >
                đăng nhập
              </Button>{" "}
              để đánh giá.
            </Text>
          ) : (
            <VStack
              align="start"
              spacing={4}
              p={5}
              borderWidth={1}
              borderRadius="md"
            >
              <Text fontSize="lg" fontWeight="semibold">
                Thêm đánh giá mới
              </Text>
              <HStack>
                <Text>Đánh giá:</Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    boxSize={6}
                    cursor="pointer"
                    color={star <= rating ? "yellow.400" : "gray.300"}
                    onClick={() => setRating(star)}
                    _hover={{ transform: "scale(1.2)" }}
                    transition="transform 0.2s"
                  />
                ))}
              </HStack>
              <Textarea
                placeholder="Nhận xét của bạn về sản phẩm..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                size="md"
              />
              <Button
                colorScheme="teal"
                isLoading={isSubmittingReview}
                onClick={() => {
                  if (rating === 0 || comment.trim() === "") {
                    return toast({
                      title: "Vui lòng nhập đầy đủ thông tin",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                  sendReview({ productId: data.id, rating, comment });
                }}
              >
                Gửi đánh giá
              </Button>
            </VStack>
          )}
        </Box>

        {/* Reviews List */}
        <Box>
          <Heading size="md" mb={4}>
            Đánh giá từ khách hàng
          </Heading>
          {isLoadingReview ? (
            <Center p={10}>
              <Spinner />
            </Center>
          ) : dataReviews && dataReviews.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {dataReviews.map((review) => (
                <ProductReview
                  key={review.id}
                  review={review}
                  productId={data.id}
                  onCommentAdded={refetchReview}
                />
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">Chưa có đánh giá nào cho sản phẩm này.</Text>
          )}
        </Box>
      </Box>

      {/* Zoom Modal */}
      {isZoomed && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.85)"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="zoom-out"
          onClick={toggleZoom}
        >
          <IconButton
            position="absolute"
            top="4"
            right="4"
            aria-label="Close"
            icon={<CloseIcon />}
            colorScheme="whiteAlpha"
            onClick={toggleZoom}
            zIndex="tooltip"
          />
          <Image
            src={initialImage}
            alt={data.name}
            maxH="90vh"
            maxW="90vw"
            objectFit="contain"
            onClick={(e) => e.stopPropagation()}
          />
          <IconButton
            aria-label="Previous image"
            icon={<ChevronLeftIcon boxSize={8} />}
            position="absolute"
            left="4"
            colorScheme="whiteAlpha"
            rounded="full"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
          />
          <IconButton
            aria-label="Next image"
            icon={<ChevronRightIcon boxSize={8} />}
            position="absolute"
            right="4"
            colorScheme="whiteAlpha"
            rounded="full"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
          />
        </Box>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Chưa đăng nhập
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Huỷ
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => navigate("/login")}
                ml={3}
              >
                Đăng nhập
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default ProductDetails;
