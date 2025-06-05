import { useContext, useEffect, useState } from "react";
import {
  Box,
  chakra,
  Text,
  Image,
  Button,
  Heading,
  Center,
  HStack,
  Icon,
  Tooltip,
  SimpleGrid,
  Select,
  Stack,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import axios from "axios";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { getAppToken } from "../configs/token";
import { useQueryProductsList } from "../services/customers/products";
import { set } from "lodash";
import { BASE_URL } from "../configs/auth";
import { BsEmojiSmile } from "react-icons/bs";
import { Empty } from "antd";
// import { SearchContext } from "../Utilis/Context/SearchContext";
// "https://makeup-api.herokuapp.com/api/v1/products.json"
//https://skin-care-hub.onrender.com/product?l=all&q=
const ProductPage = () => {
  const { user, setUser, search, setSearch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [noofElements, setNoofElements] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const navigate = useNavigate();
  const tokenApp = getAppToken();

  const { data, isLoading, isError } = useQueryProductsList({
    pageNumber: 0,
    pageSize: 20,
    keyword: search,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setPosts(data?.items || []);
      setNoofElements(10);
      console.log("data in useEffect", data);
    };
    fetchProducts();
  }, [data, isLoading]);

  //setLoad(true);
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     //setLoad(true);

  //     const res = await axios.get(
  //       `https://BadmintonStore.onrender.com/product/search/${search}/${sortBy}`,
  //       { withCredentials: true }
  //     );
  //     console.log(res.data.data);
  //     setPosts(res.data.data);
  //     setNoofElements(10);

  //     setLoad(false);
  //   };
  //   fetchPosts();
  // }, [sortBy, search]);

  function handleQuickBuy(id) {
    if (!tokenApp) {
      return navigate("/login");
    }
    // navigate(`/CartPage/${id}`);
    console.log(id);
    id.user_id = user.id;
    axios
      .post(`https://BadmintonStore.onrender.com/product/cart`, id, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res.data.data)
        // setCartId(res.data.data)
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const slice = posts.slice(0, noofElements);
  const loadMore = () => {
    setNoofElements(noofElements + noofElements);
  };
  if (isLoading) {
    return (
      <Image
        m="auto"
        mt="150px"
        src="https://media.tenor.com/BtC0jVjzYToAAAAM/loading-chain.gif"
      />
    );
  }
  return (
    <>
      <SimpleGrid gap={10} gridTemplateColumns={"1fr 1fr"} p={2}>
        <HStack display="grid" gridTemplateColumns={"0.5fr 1.5fr"} p={2}>
          <Heading fontWeight="200">Category</Heading>
          <Select
            placeholder="Select option"
            onChange={(e) => setSearch(e.target.value)}
          >
            <option value="eyeliner">Eyeliner</option>
            <option value="foundation">Foundation</option>
            <option value="eyeshadow">Eye Shadow</option>
            <option value="lipstick">Lipstick</option>
            <option value="mascara">Mascara</option>
            <option value="bronzer">Bronzer</option>
            <option value="nail polish">Nail Polish</option>
            <option value="lip liner">Lip Liner</option>
          </Select>
        </HStack>
        {/* <RadioGroup onChange={setProductype} value={productype}>
            <Stack direction="row">
              <Radio value="eyeliner">Eyeliner</Radio>
              <Radio value="foundation">Foundation</Radio>
            </Stack>
          </RadioGroup> */}
        <HStack>
          <RadioGroup onChange={setSortBy} value={sortBy}>
            <Stack direction="row">
              <Radio value="asc" onClick={(e) => setSortBy("asc")}>
                Price Low To High
              </Radio>
              <Radio value="desc" onClick={(e) => setSortBy("desc")}>
                Price High To Low
              </Radio>
            </Stack>
          </RadioGroup>
        </HStack>
        {/* WOrking Radio Button dont delete */}
        {/*  <RadioGroup onChange={setProductype} value={productype}>
            <Stack direction="row">
              <Radio value="eyeliner">Eyeliner</Radio>
              <Radio value="foundation">Foundation</Radio>
              <Radio value="eyeshadow">Eye Shadow</Radio>
              <Radio value="lipstick">Lipstick</Radio>
              <Radio value="mascara">Mascara</Radio>
              <Radio value="bronzer">Bronzer</Radio>
              <Radio value="blush">Blush</Radio>
              <Radio value="nail_polish">Nail Polish</Radio>
              <Radio value="lip_liner">Lip Liner</Radio>
            </Stack>
          </RadioGroup> */}
      </SimpleGrid>
      {slice.length !== 0 ? (
        <Box
          w="95%"
          mx="auto"
          display="grid"
          gridTemplateColumns={["1fr", "1fr 1fr", "repeat(4, 1fr)"]}
          p={4}
          gap={6}
        >
          {slice &&
            slice.map((el, index) => (
              <Center key={index} py={4}>
                <Box
                  w="100%"
                  bg="white"
                  rounded="xl"
                  shadow="md"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
                  position="relative"
                >
                  {el.quantity < 1 && (
                    <Alert status="error" roundedTop="xl">
                      <AlertIcon />
                      <AlertTitle>Out Of Stock!</AlertTitle>
                    </Alert>
                  )}

                  <Box cursor="pointer">
                    <Image
                      boxSize="270px"
                      mx="auto"
                      src={
                        `${BASE_URL}${el?.images?.[0]}` || "/placeholder.png"
                      }
                      alt={el.name}
                      objectFit="contain"
                      p={3}
                      onError={(e) => {
                        e.target.src =
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsNGGjrfSqqv8UjL18xS4YypbK-q7po_8oVQ&usqp=CAU";
                        e.onError = null;
                      }}
                    />
                  </Box>

                  <Box p={4}>
                    <Heading
                      as="h3"
                      fontSize="md"
                      fontWeight="semibold"
                      noOfLines={2}
                      mb={1}
                    >
                      {el.name}
                    </Heading>

                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Thương hiệu: {el?.brand?.name || "New Brand"}
                    </Text>

                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="cyan.600"
                      textAlign="center"
                      mb={3}
                    >
                      {el?.variants[0]?.price?.toLocaleString() ?? "0"} ₫
                    </Text>

                    <HStack
                      p={2}
                      justify="center"
                      bg="black"
                      color="white"
                      borderRadius="md"
                      _hover={{ bg: "cyan.500" }}
                      cursor="pointer"
                    >
                      <Tooltip
                        label="Add to cart"
                        bg="white"
                        placement="top"
                        color="black"
                        fontSize="md"
                      >
                        <chakra.a onClick={() => handleQuickBuy(el)}>
                          <HStack spacing={2}>
                            <Icon as={FiShoppingCart} h={6} w={6} />
                            <Text fontSize="md" fontWeight="bold">
                              QUICKBUY
                            </Text>
                          </HStack>
                        </chakra.a>
                      </Tooltip>
                    </HStack>
                  </Box>
                </Box>
              </Center>
            ))}
        </Box>
      ) : (
        <Empty description={<span>Không có sản phẩm nào</span>} />
      )}

      {/* <Button
        fontWeight="600"
        bgColor="black"
        color="white"
        borderRadius="0"
        border={"2px solid black"}
        _hover={{
          bg: "cyan.500",
        }}
        onClick={() => loadMore()}
        p={4}
      >
        Load More
      </Button> */}
    </>
  );
};
export default ProductPage;
