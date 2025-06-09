import { Box, Flex, Text, Image } from "@chakra-ui/react";
import Crousel from "../../../components/Home/Crousel";
import Trending from "../../../components/Home/Trending";
import CardSlide from "../../../components/Home/CardSlide";
import Middle from "../../../components/Home/Middle";
import { ProductSlider } from "../../../components/Home/MainProductSlide";
import ProductList from "../../../components/Home/ProductList";
import Categories from "../../../components/Home/categories-main-dashboard";
import { useQueryCategoryList } from "../../../services/admins/categories";
const mockProducts = [
  {
    Id: "1",
    Name: "Vợt cầu lông Yonex Astrox 100ZZ",
    Description: "Vợt đánh đơn chuyên công cao cấp",
    BrandId: "b1",
    SupplierId: "s1",
    CreatedAt: "2024-01-01",
    Images: [
      "https://shopvnb.com//uploads/san_pham/vot-cau-long-yonex-astrox-100zz-chinh-hang-1.webp",
    ],
    ProductCategories: [],
    Variants: [
      {
        Id: "v1",
        Name: "Đỏ",
        Color: "Red",
        SKU: "AST100ZZ-RED",
        Unit: "cái",
        Description: "Màu đỏ, 4U G5",
        Size: "4U",
        Price: 3200000,
        StockQuantity: 10,
        Images: [
          "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
        ],
        Attribute: ["4U", "G5"],
      },
    ],
  },
  {
    Id: "2",
    Name: "Giày cầu lông Mizuno Wave Fang",
    Description: "Giày cao cấp hỗ trợ di chuyển nhanh",
    BrandId: "b2",
    SupplierId: "s2",
    CreatedAt: "2024-02-01",
    Images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrQeHj1-qGV5jx1kKkzJKBj-yu5hP8WZPUoA&s",
    ],
    ProductCategories: [],
    Variants: [
      {
        Id: "v2",
        Name: "Xanh",
        Color: "Blue",
        SKU: "MZNWF-BLUE",
        Unit: "đôi",
        Description: "Màu xanh size 42",
        Size: "42",
        Price: 1900000,
        StockQuantity: 5,
        Images: [
          "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
        ],
        Attribute: ["Size 42"],
      },
    ],
  },
  {
    Id: "3",
    Name: "Băng quấn cán vợt",
    Description: "Chống trơn trượt, thấm mồ hôi",
    BrandId: "b3",
    SupplierId: "s3",
    CreatedAt: "2024-03-01",
    Images: [
      "https://shopvnb.com//uploads/san_pham/quan-can-vot-cau-long-t-t-1.webp",
    ],
    ProductCategories: [],
    Variants: [
      {
        Id: "v3",
        Name: "Đen",
        Color: "Black",
        SKU: "GRIP-BLACK",
        Unit: "cuộn",
        Description: "Băng quấn màu đen, siêu bền",
        Size: "One size",
        Price: 30000,
        StockQuantity: 100,
        Images: [
          "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
        ],
        Attribute: [],
      },
    ],
  },
  {
    Id: "1",
    Name: "Vợt cầu lông Yonex Astrox 100ZZ",
    Description: "Vợt đánh đơn chuyên công cao cấp",
    BrandId: "b1",
    SupplierId: "s1",
    CreatedAt: "2024-01-01",
    Images: [
      "https://shopvnb.com//uploads/san_pham/vot-cau-long-yonex-astrox-100zz-chinh-hang-1.webp",
    ],
    ProductCategories: [],
    Variants: [
      {
        Id: "v1",
        Name: "Đỏ",
        Color: "Red",
        SKU: "AST100ZZ-RED",
        Unit: "cái",
        Description: "Màu đỏ, 4U G5",
        Size: "4U",
        Price: 3200000,
        StockQuantity: 10,
        Images: [
          "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
        ],
        Attribute: ["4U", "G5"],
      },
    ],
  },
  {
    Id: "2",
    Name: "Giày cầu lông Mizuno Wave Fang",
    Description: "Giày cao cấp hỗ trợ di chuyển nhanh",
    BrandId: "b2",
    SupplierId: "s2",
    CreatedAt: "2024-02-01",
    Images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrQeHj1-qGV5jx1kKkzJKBj-yu5hP8WZPUoA&s",
    ],
    ProductCategories: [],
    Variants: [
      {
        Id: "v2",
        Name: "Xanh",
        Color: "Blue",
        SKU: "MZNWF-BLUE",
        Unit: "đôi",
        Description: "Màu xanh size 42",
        Size: "42",
        Price: 1900000,
        StockQuantity: 5,
        Images: [
          "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
        ],
        Attribute: ["Size 42"],
      },
    ],
  },
  {
    Id: "3",
    Name: "Băng quấn cán vợt",
    Description: "Chống trơn trượt, thấm mồ hôi",
    BrandId: "b3",
    SupplierId: "s3",
    CreatedAt: "2024-03-01",
    Images: [
      "https://shopvnb.com//uploads/san_pham/quan-can-vot-cau-long-t-t-1.webp",
    ],
    ProductCategories: [],
    Variants: [
      {
        Id: "v3",
        Name: "Đen",
        Color: "Black",
        SKU: "GRIP-BLACK",
        Unit: "cuộn",
        Description: "Băng quấn màu đen, siêu bền",
        Size: "One size",
        Price: 30000,
        StockQuantity: 100,
        Images: [
          "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
        ],
        Attribute: [],
      },
    ],
  },  
];
export default function Home() {
  return (
    <Flex justifyContent={"center"} flexDir={"column"} alignItems={"center"}>
      <Crousel />
      <Box m={8} p={4} w={"90%"}>
        <Categories />
      </Box>

      <Box m={8} w={"90%"}>
        <ProductSlider products={mockProducts} />
      </Box>
      <Box w={"90%"}>
        <ProductList />
      </Box>
      <Trending />
      <CardSlide />
      <Middle />
    </Flex>
  );
}
