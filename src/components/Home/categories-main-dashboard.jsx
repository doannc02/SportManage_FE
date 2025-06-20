import { Card } from "antd";
import { twMerge } from "tailwind-merge";
import { useQueryCategoryList } from "../../services/admins/categories";
import { Box, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { BASE_URL } from "../../configs/auth";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";

const getLogoUrl = (logo) =>
  logo
    ? `${logo}`
    : "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";

const CategoryMainDashBoard = () => {
  const navigate = useNavigate();
  const { data } = useQueryCategoryList({
    keyword: "",
    sizeNumber: 20,
    pageNumber: 0,
  });
  // Số lượng item mỗi slide theo breakpoint
  const groupSize = {
    base: 4, // 2x2 trên mobile
    sm: 6, // 3x2
    md: 8, // 4x2
    lg: 12, // 6x2
    xl: 16, // 8x2
  };
  // Helper để lấy groupSize phù hợp với màn hình
  const getCurrentGroupSize = () => {
    if (window.innerWidth < 640) return groupSize.base;
    if (window.innerWidth < 768) return groupSize.sm;
    if (window.innerWidth < 1024) return groupSize.md;
    if (window.innerWidth < 1280) return groupSize.lg;
    return groupSize.xl;
  };
  const [currentGroupSize, setCurrentGroupSize] = useState(
    getCurrentGroupSize()
  );

  useEffect(() => {
    const handleResize = () => {
      setCurrentGroupSize(getCurrentGroupSize());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={4}
      bg={"white"}
      p={"2rem"}
      my={8}  
      w={"100%"}
    >
      <Text
        textTransform="uppercase"
        className="mb-4"
        textColor={"#787877"}
        textAlign={{ base: "center", md: "left" }}
      >
        Danh mục sản phẩm
      </Text>

      <div className="w-full  mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Pagination, Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 1,
            },
          }}
          className="category-swiper"
        >
          {(() => {
            const items = data?.items || [];

            const slides = [];
            for (let i = 0; i < items.length; i += currentGroupSize) {
              const group = items.slice(i, i + currentGroupSize);
              slides.push(
                <SwiperSlide key={i}>
                  <div
                    className={twMerge(
                      // 2 cột 2 hàng trên mobile, 3x2 trên sm, 4x2 trên md, 6x2 trên lg, 8x2 trên xl
                      "grid grid-cols-2 grid-rows-2",
                      "sm:grid-cols-3 sm:grid-rows-2",
                      "md:grid-cols-4 md:grid-rows-2",
                      "lg:grid-cols-6 lg:grid-rows-2",
                      "xl:grid-cols-8 xl:grid-rows-2",
                      "px-4 my-2"
                    )}
                  >
                    {group.map((cat) => (
                      <Card
                        key={cat.id}
                        onClick={() =>
                          navigate(
                            `/productpage?category=${encodeURIComponent(
                              cat.id
                            )}`
                          )
                        }
                        hoverable
                        className={twMerge(
                          "w-full aspect-square flex flex-col items-center justify-center h-[180px]",
                          "hover:shadow-sm transition-all duration-200",
                          "min-h-0 !rounded-none"
                        )}
                        bodyStyle={{
                          padding: "12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                          <img
                            src={getLogoUrl(cat.logo)}
                            alt={cat.name}
                            className="object-contain w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";
                            }}
                          />
                        </div>
                        <h3
                          className="text-xs sm:text-sm md:text-base font-medium text-gray-900 text-center line-clamp-2"
                          style={{ marginTop: "5px" }}
                        >
                          {cat.name}
                        </h3>
                      </Card>
                    ))}
                  </div>
                </SwiperSlide>
              );
            }
            return slides;
          })()}
        </Swiper>
      </div>
    </Box>
  );
};

export default CategoryMainDashBoard;
