import { Box, Flex, Text, Image } from "@chakra-ui/react";
import Crousel from "../components/Home/Crousel";
import Trending from "../components/Home/Trending";
import CardSlide from "../components/Home/CardSlide";
import Middle from "../components/Home/Middle";
import { ProductSlider } from "../components/Home/MainProductSlide";
import ProductList from "../components/Home/ProductList";
const mockProducts = [
  {
    Id: '1',
    Name: 'Vợt cầu lông Yonex Astrox 100ZZ',
    Description: 'Vợt đánh đơn chuyên công cao cấp',
    BrandId: 'b1',
    SupplierId: 's1',
    CreatedAt: '2024-01-01',
    Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
    ProductCategories: [],
    Variants: [
      {
        Id: 'v1',
        Name: 'Đỏ',
        Color: 'Red',
        SKU: 'AST100ZZ-RED',
        Unit: 'cái',
        Description: 'Màu đỏ, 4U G5',
        Size: '4U',
        Price: 3200000,
        StockQuantity: 10,
        Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
        Attribute: ['4U', 'G5']
      }
    ]
  },
  {
    Id: '2',
    Name: 'Giày cầu lông Mizuno Wave Fang',
    Description: 'Giày cao cấp hỗ trợ di chuyển nhanh',
    BrandId: 'b2',
    SupplierId: 's2',
    CreatedAt: '2024-02-01',
    Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
    ProductCategories: [],
    Variants: [
      {
        Id: 'v2',
        Name: 'Xanh',
        Color: 'Blue',
        SKU: 'MZNWF-BLUE',
        Unit: 'đôi',
        Description: 'Màu xanh size 42',
        Size: '42',
        Price: 1900000,
        StockQuantity: 5,
        Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
        Attribute: ['Size 42']
      }
    ]
  },
  {
    Id: '3',
    Name: 'Băng quấn cán vợt',
    Description: 'Chống trơn trượt, thấm mồ hôi',
    BrandId: 'b3',
    SupplierId: 's3',
    CreatedAt: '2024-03-01',
    Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
    ProductCategories: [],
    Variants: [
      {
        Id: 'v3',
        Name: 'Đen',
        Color: 'Black',
        SKU: 'GRIP-BLACK',
        Unit: 'cuộn',
        Description: 'Băng quấn màu đen, siêu bền',
        Size: 'One size',
        Price: 30000,
        StockQuantity: 100,
        Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
        Attribute: []
      }
    ]
  },
  {
    Id: '1',
    Name: 'Vợt cầu lông Yonex Astrox 100ZZ',
    Description: 'Vợt đánh đơn chuyên công cao cấp',
    BrandId: 'b1',
    SupplierId: 's1',
    CreatedAt: '2024-01-01',
    Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
    ProductCategories: [],
    Variants: [
      {
        Id: 'v1',
        Name: 'Đỏ',
        Color: 'Red',
        SKU: 'AST100ZZ-RED',
        Unit: 'cái',
        Description: 'Màu đỏ, 4U G5',
        Size: '4U',
        Price: 3200000,
        StockQuantity: 10,
        Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
        Attribute: ['4U', 'G5']
      }
    ]
  },
  {
    Id: '2',
    Name: 'Giày cầu lông Mizuno Wave Fang',
    Description: 'Giày cao cấp hỗ trợ di chuyển nhanh',
    BrandId: 'b2',
    SupplierId: 's2',
    CreatedAt: '2024-02-01',
    Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
    ProductCategories: [],
    Variants: [
      {
        Id: 'v2',
        Name: 'Xanh',
        Color: 'Blue',
        SKU: 'MZNWF-BLUE',
        Unit: 'đôi',
        Description: 'Màu xanh size 42',
        Size: '42',
        Price: 1900000,
        StockQuantity: 5,
        Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
        Attribute: ['Size 42']
      }
    ]
  },
  {
    Id: '3',
    Name: 'Băng quấn cán vợt',
    Description: 'Chống trơn trượt, thấm mồ hôi',
    BrandId: 'b3',
    SupplierId: 's3',
    CreatedAt: '2024-03-01',
    Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
    ProductCategories: [],
    Variants: [
      {
        Id: 'v3',
        Name: 'Đen',
        Color: 'Black',
        SKU: 'GRIP-BLACK',
        Unit: 'cuộn',
        Description: 'Băng quấn màu đen, siêu bền',
        Size: 'One size',
        Price: 30000,
        StockQuantity: 100,
        Images: ['https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg'],
        Attribute: []
      }
    ]
  }
]
export default function Home() {
  return (
    <Flex justifyContent={"center"} flexDir={"column"} alignItems={"center"}>
      <Box
        bg={"black"}
        w={"92%"}
        h={"40px"}
        color={"white"}
        textAlign={"center"}
        py="8px"
        fontSize={"12px"}
        m={3}
        _hover={{ bg: "white", color: "black" }}
      >
        <Text fontSize={"18px"} fontWeight={"bold"}>
          15% off select products with code SS15 + 2 free gifts @ $150+{" "}
        </Text>
      </Box>
      <Crousel />

      <Box m={8} w={"90%"} >
        <ProductSlider products={mockProducts} />
      </Box>
      <Box m={8} w={"90%"} >
        <ProductList />
      </Box>
      <Trending />
      <Box m={8} w={"90%"} >
        <Image w={"100%"} src="https://static.thcdn.com/images/xlarge/webp/widgets/121-us/54/original-Page-005-035154.png" />
      </Box>
      <CardSlide />
      <Middle />
    </Flex>
  );
}
