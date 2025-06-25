import {
  Box,
  Container,
  HStack,
  VStack,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Flex,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const LoadingOrderPageAdmin = () => {
  return (
    <Box minH="100vh">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200">
        <Container maxW="9xl" py={4}>
          <HStack spacing={4}>
            <Box>
              <HStack align="flex-start" spacing={3}>
                <Skeleton height="32px" width="250px" />
              </HStack>
              <HStack align="flex-start" spacing={3}></HStack>
              <HStack align="flex-start" spacing={3} mt={3}>
                <SkeletonCircle size="6" />
                <Skeleton height="20px" width="120px" />
                <SkeletonCircle size="6" />
              </HStack>
              <HStack align="flex-start" spacing={3}>
                <SkeletonCircle size="6" />
                <Skeleton height="20px" width="100px" />
              </HStack>
              <HStack align="flex-start" spacing={3}>
                <SkeletonCircle size="6" />
                <Skeleton height="20px" width="100px" />
              </HStack>
              <HStack align="flex-start" spacing={3}>
                <SkeletonCircle size="6" />
                <Skeleton height="20px" width="180px" />
              </HStack>
            </Box>
          </HStack>
        </Container>
      </Box>

      <Container maxW="9xl" py={8}>
        <VStack align="stretch" spacing={6}>
          {/* Order Status */}
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Skeleton height="24px" width="180px" />
                <Badge
                  colorScheme="gray"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  <HStack spacing={2}>
                    <SkeletonCircle size="4" />
                    <Skeleton height="18px" width="80px" />
                  </HStack>
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Timeline Skeleton */}
                <Skeleton height="40px" width="100%" borderRadius="md" />
                <Skeleton height="40px" width="100%" borderRadius="md" />
                <Skeleton height="40px" width="100%" borderRadius="md" />
              </VStack>
              <Alert status="info" mt={6} borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    <Skeleton height="20px" width="120px" />
                  </AlertTitle>
                  <AlertDescription>
                    <SkeletonText mt="2" noOfLines={2} spacing="2" />
                  </AlertDescription>
                </Box>
              </Alert>
            </CardBody>
          </Card>

          {/* Order Items */}
          <Card bg="white">
            <CardHeader borderBottom="1px" borderColor="gray.200">
              <Skeleton height="24px" width="160px" />
            </CardHeader>
            <CardBody p={0}>
              <VStack spacing={4} align="stretch" p={4}>
                {[1, 2].map((i) => (
                  <HStack key={i} spacing={4}>
                    <Skeleton boxSize="60px" borderRadius="md" />
                    <VStack align="start" spacing={2} flex={1}>
                      <Skeleton height="16px" width="120px" />
                      <Skeleton height="14px" width="80px" />
                    </VStack>
                    <Skeleton height="20px" width="60px" />
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={2}>
            {/* Main content */}
            <GridItem>
              <VStack align="stretch" spacing={6}>
                {/* Order Summary */}
                <Card bg="white">
                  <CardHeader>
                    <Skeleton height="24px" width="160px" />
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch" fontSize="sm">
                      <Flex justify="space-between">
                        <Skeleton height="16px" width="80px" />
                        <Skeleton height="16px" width="80px" />
                      </Flex>
                      <Flex justify="space-between">
                        <Skeleton height="16px" width="120px" />
                        <Skeleton height="16px" width="60px" />
                      </Flex>
                      <Divider />
                      <Flex
                        justify="space-between"
                        fontWeight="semibold"
                        fontSize="lg"
                      >
                        <Skeleton height="20px" width="80px" />
                        <Skeleton height="20px" width="100px" />
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
                {/* Order Info */}
                <Card bg="white">
                  <CardHeader>
                    <Skeleton height="24px" width="140px" />
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch" fontSize="sm">
                      <HStack spacing={3}>
                        <SkeletonCircle size="6" />
                        <Box>
                          <Skeleton height="16px" width="80px" />
                          <Skeleton height="16px" width="100px" />
                        </Box>
                      </HStack>
                      <HStack spacing={3}>
                        <SkeletonCircle size="6" />
                        <Box>
                          <Skeleton height="16px" width="100px" />
                          <Skeleton height="16px" width="120px" />
                        </Box>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </GridItem>

            {/* Sidebar */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Payment Information */}
                <Card bg="white">
                  <CardHeader>
                    <Skeleton height="24px" width="160px" />
                  </CardHeader>
                  <CardBody>
                    <HStack spacing={3}>
                      <SkeletonCircle size="6" />
                      <Box>
                        <Skeleton height="16px" width="100px" />
                        <Skeleton height="14px" width="80px" />
                      </Box>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </GridItem>
          </Grid>

          {/* Customer Actions */}
          <Card bg="white">
            <CardHeader>
              <Skeleton height="24px" width="120px" />
            </CardHeader>
            <CardBody>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                <Skeleton height="40px" width="100%" borderRadius="md" />
                <Skeleton height="40px" width="100%" borderRadius="md" />
              </Grid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoadingOrderPageAdmin;
