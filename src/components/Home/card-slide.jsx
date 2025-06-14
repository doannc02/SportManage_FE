import { Swiper, SwiperSlide } from "swiper/react";
import { Image, Button, Text, Box, useBreakpointValue } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Scrollbar } from "swiper/modules";

export default function ProductSlider() {
  let data = [
    {
      id: 1048,
      brand: "colourpop",
      name: "Chantecaille The Ultimate Lifting Duo ",
      price: "530.0",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973768-8004998593922840.jpg",
      description:
        "Lippie Pencil A long-wearing and high-intensity lip pencil that glides on easily and prevents feathering. Many of our Lippie Stix have a coordinating Lippie Pencil designed to compliment it perfectly, but feel free to mix and match!",
    },
    {
      id: 1047,
      brand: "colourpop",
      name: "111SKIN Celestial Black Diamond Eye  ",
      price: "17",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/13953406-7084994955681930.jpg",
      description:
        "Blotted Lip Sheer matte lipstick that creates the perfect popsicle pout! Formula is lightweight, matte and buildable for light to medium coverage.",
    },
    {
      id: 1046,
      brand: "colourpop",
      name: "Medik8 A Winter's Day Kit for girls",
      price: "110",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/13953407-6534994956012731.jpg",
      description:
        "Lippie Stix Formula contains Vitamin E, Mango, Avocado, and Shea butter for added comfort and moisture. None of our Lippie formulas contain any nasty ingredients like Parabens or Sulfates.",
    },
    {
      id: 1045,
      brand: "colourpop",
      name: "NEST Fragrances Birchwood Pine 3-",
      price: "78.0",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/1600/1600/12691024-3064813757049624.jpg",
      description:
        "Developed for the Selfie Age, our buildable full coverage, natural matte foundation delivers flawless looking skin from day-to-night. The oil-free, lightweight formula blends smoothly and is easily customizable to create the coverage you want. Build it up or sheer it out, it was developed with innovative soft-blurring pigments to deliver true color while looking and feeling natural. The lockable pump is easy to use and keeps your routine mess-free! As always, 100% cruelty-free and vegan.",
    },
    {
      id: 1044,
      brand: "boosh",
      name: "NEST New York Bamboo Reed Diffuser",
      price: "58.0",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/11288823-1724904688328701.jpg",
      product_link: "https://www.boosh.ca/collections/all",
      website_link: "https://www.boosh.ca/",
      description:
        "All of our products are free from lead and heavy metals, parabens, phthalates, artificial colourants, and synthetic fragrances.  Boosh lipstick glides on smoothly for clean & protective SPF coverage. They are filled with hydrating oils and butters to preserve and enhance your lips natural surface. Organic sweet orange oil gives a light and cheerful scent.",
    },
    {
      id: 1043,
      brand: "deciem",
      name: "Obagi Clinical Kinetin+ Hydrating Cream ",
      price: "60",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/12903729-5714884454997658.jpg",
      description:
        "Serum Foundations are lightweight medium-coverage formulations available in a comprehensive shade range across 21 shades. These foundations offer moderate coverage that looks natural with a very lightweight serum feel. They are very low in viscosity and are dispensed with the supplied pump or with the optional glass dropper available for purchase separately if preferred. ",
    },
    {
      id: 1042,
      brand: "deciem",
      name: "U Beauty The Resurfacing Holiday Set ",
      price: "6.9",
      price_sign: "$",
      currency: "CAD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/13973773-1724997258190192.jpg",
      product_link:
        "https://deciem.com/product/rdn-coverage-foundation-33-n-30ml",
      website_link: "https://deciem.com/",
      description:
        "Coverage Foundations are full-coverage formulations available in a comprehensive shade range across 21 shades. These foundations contain higher pigment levels than our Serum Foundations but still offer a smooth finish that avoids the heavy makeup look that can make skin appear more aged. The texture is that of a lightweight, non-oily cream.",
    },
    {
      id: 1041,
      brand: "zorah biocosmetiques",
      name: "BIOEFFECT Hydration Heroes Set ",
      price: "144439.0",
      price_sign: "$",
      currency: "USD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/13890003-7054997222870475.jpg",
      description:
        "<strong>12 hours of long-lasting</strong> intense color, transfer-free (leaves no trace on crease above the eyelid) <strong>Pure Light Capture®</strong> <strong>minerals</strong> deliver color and radiance. Silky lines and refreshingly light, Pure Argan eyeliner leaves a weightless feel on the eyelids.<p align='LEFT'>Natural cosmetic certified by Ecocert Greenlife according to Ecocert Standard available at: http://cosmetiques.ecocert.com</p>98% of the total ingredients are from natural origin 5% of total ingredients are from organic farming",
    },
    {
      id: 1039,
      brand: "w3llpeople",
      name: " Christophe Robin Cleansing Purifying ",
      price: "53.0",
      price_sign: "$",
      currency: "USD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/12635437-9444884719322309.jpg",
      product_link:
        "https://www.purpicks.com/product/w3llpeople-realist-invisible-setting-powder/",
      website_link: "https://purpicks.com/",
      description:
        '<span style="font-weight: 400;">Keep it real with a polished, soft-focus look using this superfine, loose mineral powder. The healing properties of organic aloe help soothe and calm stressed out skin. Instantly minimize pores, soften imperfections, and creates a matte finish with superfine powder. Use by itself for an air-brushed look, or to set foundation for ultra-long wear.</span><span style="font-weight: 400;">* Set makeup or by itself for matte air-brushed effect</span><span style="font-weight: 400;">* Absorbs excess oil while softening fine lines</span><span style="font-weight: 400;">* Organic aloe creates radiant, rejuvenated skin</span><span style="font-weight: 400;">* Hypoallergenic, Chemical Free, Cruelty Free &amp; Noncomedogenic </span><span style="font-weight: 400;">* EWG Verified for non-toxic health and safety</span><span style="font-weight: 400;">* Free From: Parabens, Gluten, GMO, Phthalates, Sulfates, Fragrance, Pheonoxyethanol, Dimethicone, PEG, Propylene Glycol, Butylene Glycol, Lead, Mineral Oil, Talc</span>',
    },
    {
      id: 1038,
      brand: "sally b's skin yummies",
      name: "Christophe Robin Cleansing Thickening  ",
      price: "53.0",
      price_sign: "$",
      currency: "USD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/12635436-1174884720250929.jpg",
      product_link:
        "https://www.purpicks.com/product/sally-bs-skin-yummies-b-smudged/",
      website_link: "https://purpicks.com/",
      description:
        "Let your eyes naturally pop with our B Smudged, a subtle eye color that adds a tint of color to the base of your lashes. An organic, cream eye color, B Smudged eliminates the inevitable uneven line from traditional eyeliners, and does not require expert blending techniques of messy, powder-based shadows. Simply 'smudge' along lash line for color that stays in place for a long lasting look.",
    },
    {
      id: 1037,
      brand: "sally b's skin yummies",
      name: "Christophe Robin Luscious Curl Ritual",
      price: "38.0",
      price_sign: "$",
      currency: "USD",
      image_link:
        "https://static.thcdn.com/images/xsmall/webp//productimg/original/12752678-1894894638558975.jpg",
      product_link:
        "https://www.purpicks.com/product/sally-bs-skin-yummies-b-glossy-lip-gloss/",
      website_link: "https://purpicks.com/",
      description:
        "Intensify your natural lip color with Sally B's B Glossy Lip Gloss, an organic lip gloss that adds a silky smooth hint of color and shimmer to lips. Formulated with 98% certified organic, moisture-rich ingredients our B Glossy Lip Gloss works to enrich lip health for lips that feel good and look even better.",
    },
  ];

  // Responsive values
  const slidesPerView = useBreakpointValue({ base: 1.5, sm: 2, md: 3, lg: 4 });
  const spaceBetween = useBreakpointValue({ base: 16, md: 24, lg: 30 });
  const imageSize = useBreakpointValue({ base: "160px", sm: "180px", md: "200px", lg: "220px" });
  const titleFontSize = useBreakpointValue({ base: "md", sm: "lg", md: "xl" });
  const priceFontSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl" });
  const descFontSize = useBreakpointValue({ base: "xs", sm: "sm" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const cardPadding = useBreakpointValue({ base: 3, md: 4, lg: 5 });

  return (
    <Box
      maxW="1400px"
      mx="auto"
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 6 }}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      mt={{ base: 6, md: 10 }}
    >
      <Text
        fontWeight={700}
        w="100%"
        textAlign="center"
        mb={{ base: 6, md: 8 }}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        letterSpacing="wide"
        color="gray.800"
      >
        Gợi ý cho bạn
      </Text>
      
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        scrollbar={{ hide: true }}
        modules={[Scrollbar, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper"
        style={{ 
          padding: "0 8px 32px 8px",
          width: "100%"
        }}
      >
        {data.map((el) => (
          <SwiperSlide key={el.id} style={{ height: "auto" }}>
            <Box
              bg="gray.50"
              borderRadius="xl"
              boxShadow="md"
              p={cardPadding}
              h="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              transition="all 0.3s ease"
              _hover={{ 
                boxShadow: "xl", 
                transform: "translateY(-4px)",
                bg: "gray.100"
              }}
            >
              <Image
                mb={{ base: 3, md: 4, lg: 5 }}
                src={el.image_link}
                alt={el.name}
                borderRadius="md"
                boxSize={imageSize}
                objectFit="cover"
                bg="white"
                boxShadow="sm"
                loading="lazy"
              />
              
              <Box flex="1" w="100%" textAlign="center">
                <Text
                  fontWeight={600}
                  fontSize={titleFontSize}
                  mb={2}
                  color="gray.700"
                  noOfLines={2}
                >
                  {el.name}
                </Text>
                
                <Text
                  fontWeight={500}
                  color="cyan.600"
                  fontSize={priceFontSize}
                  mb={2}
                >
                  {el.price_sign}
                  {el.price}
                  <Text as="span" fontSize="sm" color="gray.500" ml={1}>
                    {el.currency}
                  </Text>
                </Text>
                
                <Text
                  fontSize={descFontSize}
                  color="gray.500"
                  noOfLines={3}
                  mb={{ base: 3, md: 4 }}
                >
                  {el.description.replace(/<[^>]+>/g, "")}
                </Text>
              </Box>
              
              <Button
                w="100%"
                fontWeight="700"
                bgGradient="linear(to-r, cyan.500, blue.500)"
                color="white"
                borderRadius="md"
                size={buttonSize}
                mt="auto"
                _hover={{
                  bgGradient: "linear(to-r, blue.600, cyan.600)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
              >
                Mua ngay
              </Button>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}