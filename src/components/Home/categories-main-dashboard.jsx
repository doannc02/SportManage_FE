import { Card, Tooltip } from "antd";
import { twMerge } from "tailwind-merge";
import { useQueryCategoryList } from "../../services/admins/categories";
import { Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { BASE_URL } from "../../configs/auth";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const getLogoUrl = (logo) =>
  logo
    ? `${BASE_URL}${logo}`
    : "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";

const CategoryMainDashBoard = () => {
  const navigate = useNavigate();
  const { data } = useQueryCategoryList({
    keyword: "",
    sizeNumber: 20,
    pageNumber: 0,
  });

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <Text 
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        fontWeight="bold"
        textTransform="uppercase" 
        textAlign="center"
        className="mb-4"
      >
        Danh mục sản phẩm
      </Text>
      
      <div className="w-full max-w-screen-xl mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
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
            const groupSize = {
              base: 4,   // 2x2 trên mobile
              sm: 6,     // 3x2
              md: 8,     // 4x2
              lg: 12,    // 6x2
              xl: 16     // 8x2
            };
            
            const slides = [];
            for (let i = 0; i < items.length; i += groupSize.xl) {
              const group = items.slice(i, i + groupSize.xl);
              slides.push(
                <SwiperSlide key={i}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 px-4">
                    {group.map((cat) => (
                      <Tooltip title={cat.name} key={cat.id}>
                        <Card
                          onClick={() => navigate(`/productpage?category=${encodeURIComponent(cat.id)}`)}
                          hoverable
                          className={twMerge(
                            "w-full aspect-square flex flex-col items-center justify-center",
                            "shadow-sm hover:shadow-md transition-all duration-200",
                            "min-h-0" // Quan trọng để đảm bảo responsive
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
                                e.target.src = "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";
                              }}
                            />
                          </div>
                          <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 text-center mt-2 line-clamp-2">
                            {cat.name}
                          </h3>
                        </Card>
                      </Tooltip>
                    ))}
                  </div>
                </SwiperSlide>
              );
            }
            return slides;
          })()}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryMainDashBoard;