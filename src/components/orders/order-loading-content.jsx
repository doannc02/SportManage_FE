import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Skeleton,
} from "@chakra-ui/react";

export const OrderLoadingContent = () => (
  <Box>
    <Skeleton mb={6} w={"full"} py={6} h={{base:200, md:120}} borderRadius="xl" />

    <Container maxW="6xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
        <GridItem>
          <Skeleton mb={6} w={"full"} py={6} h={560} borderRadius="xl" />
          <Skeleton w={"full"} h={170} borderRadius="xl" />
          <Skeleton w={"full"} h={170} borderRadius="xl" />
        </GridItem>
        <GridItem>
          <Flex gap={3} flexDirection={"column"}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} w={"full"} h={170} borderRadius="xl" />
            ))}
          </Flex>
        </GridItem>
      </Grid>
    </Container>
    <Skeleton mt={6} height="200px" borderRadius="xl" />
  </Box>
);
