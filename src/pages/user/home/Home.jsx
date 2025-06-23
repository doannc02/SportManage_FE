// Home.jsx
import { Box, Flex, Spinner, Center } from "@chakra-ui/react";
import React, { Suspense } from "react";

const Crousel = React.lazy(() => import("../../../components/Home/Crousel"));
const Categories = React.lazy(() =>
  import("../../../components/Home/categories-main-dashboard")
);
const ProductSlider = React.lazy(() =>
  import("../../../components/Home/top-product-list")
);
const ProductList = React.lazy(() =>
  import("../../../components/Home/main-product-list")
);
const Trending = React.lazy(() => import("../../../components/Home/Trending"));
const CardSlide = React.lazy(() =>
  import("../../../components/Home/card-slide")
);
const Middle = React.lazy(() => import("../../../components/Home/Middle"));

const LoadingFallback = () => (
  <Center py={10}>
    <Spinner size="xl" color="blue.500" />
  </Center>
);

export default function Home() {
  return (
    <Flex
      justifyContent={"center"}
      flexDir={"column"}
      alignItems={"center"}
      bg={"#fafafa"}
      maxW={"100vw"}
    >
      <Box
        flexDir={"column"}
        alignItems={"center"}
        w={{ base: "100%", md: "100%" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Crousel />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Categories />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <ProductSlider />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <ProductList />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Trending />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <CardSlide />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Middle />
        </Suspense>
      </Box>
    </Flex>
  );
}
