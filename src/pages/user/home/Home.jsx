import { Box, Flex } from "@chakra-ui/react";
import Crousel from "../../../components/Home/Crousel";
import Trending from "../../../components/Home/Trending";
import CardSlide from "../../../components/Home/card-slide";
import Middle from "../../../components/Home/Middle";
import { ProductSlider } from "../../../components/Home/MainProductSlide";
import ProductList from "../../../components/Home/ProductList";
import Categories from "../../../components/Home/categories-main-dashboard";
import { mockProducts } from "../../../const/mock-data/mock-products";

export default function Home() {
  return (
    <Flex
      justifyContent={"center"}
      flexDir={"column"}
      alignItems={"center"}
      bg={"#fafafa"}
      maxW={"100vw"}
    >
      <Crousel />

      <Box m={8} p={4} w={"90%"}>
        <Categories />
      </Box>

      <Box m={8} w={"75%"}>
        <ProductSlider products={mockProducts} />
      </Box>
      <Box w={{base:"90%", md:"80%"}}>
        <ProductList />
      </Box>
      <Trending />
      <CardSlide />
      <Middle />
    </Flex>
  );
}
