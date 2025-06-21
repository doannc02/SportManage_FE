import { Card } from "antd";
import { twMerge } from "tailwind-merge";
import { useQueryCategoryList } from "../../services/admins/categories";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

const getLogoUrl = (logo) =>
  logo
    ? `${logo}`
    : "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";

const CategoryMainDashBoard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQueryCategoryList({
    keyword: "",
    sizeNumber: 20,
    pageNumber: 0,
  });

  const gridCols = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 8,
  });

  const gridRows = 2;
  const itemsPerSlide = gridCols * gridRows;
  const skeletonItems = Array(itemsPerSlide).fill({});

  const swiperProps = {
    slidesPerView: 1,
    spaceBetween: 0,
    modules: [Pagination, Autoplay],
    className: "category-swiper",
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,
    style: { paddingBottom: "0px" },
  };

  const gridClasses = twMerge(
    "grid gap-0", // Đảm bảo không có gap
    `grid-cols-2`,
    gridCols >= 3 ? "sm:grid-cols-3" : "",
    gridCols >= 4 ? "md:grid-cols-4" : "",
    gridCols >= 6 ? "lg:grid-cols-6" : "",
    gridCols >= 8 ? "xl:grid-cols-8" : "",
    "h-auto",
    "border-collapse" // Đảm bảo border không bị double
  );

  const cardBodyStyle = {
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  };

  // Hàm tính toán border cho từng item - tạo grid lines rõ ràng
  const getBorderStyle = (index, groupLength, gridCols, gridRows) => {
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;

    return {
      border: "1px solid #d1d5db", // Border cho tất cả các cạnh
      borderTop: row === 0 ? "1px solid #d1d5db" : "0", // Chỉ hàng đầu có border top
      borderLeft: col === 0 ? "1px solid #d1d5db" : "0", // Chỉ cột đầu có border left
      marginTop: row === 0 ? "0" : "-1px", // Overlap border để tránh double border
      marginLeft: col === 0 ? "0" : "-1px", // Overlap border để tránh double border
    };
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={4}
      p={{ base: "1rem", md: "2rem" }}
      h={"max-content"}
      w={"100%"}
    >
      <Text
        textTransform="uppercase"
        className="mb-4"
        textColor={"#787877"}
        textAlign="center"
      >
        Danh mục sản phẩm
      </Text>
      <div className="w-[95%] sm:w-[90%] md:w-[75%] lg:w-[65%] xl:w-[65%] bg-white mx-auto rounded-lg overflow-hidden shadow-sm">
        {isLoading ? (
          <Swiper {...swiperProps}>
            <SwiperSlide>
              <div
                className={gridClasses}
                style={{
                  gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
                }}
              >
                {skeletonItems.map((_, index) => (
                  <Card
                    key={`skeleton-${index}`}
                    className={twMerge(
                      "w-full aspect-square flex flex-col items-center justify-center",
                      "min-h-0 !rounded-none",
                      "!border-none bg-gray-50"
                    )}
                    style={{
                      height: "auto",
                      minHeight: "160px",
                      ...getBorderStyle(
                        index,
                        skeletonItems.length,
                        gridCols,
                        gridRows
                      ),
                    }}
                    bodyStyle={cardBodyStyle}
                  >
                    <Skeleton.Avatar
                      active
                      size="large"
                      shape="square"
                      className="w-7 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      className="mt-2 w-3/4"
                    />
                  </Card>
                ))}
              </div>
            </SwiperSlide>
          </Swiper>
        ) : (
          <Swiper {...swiperProps}>
            {(() => {
              const items = data?.items || [];
              const slides = [];

              for (let i = 0; i < items.length; i += itemsPerSlide) {
                const group = items.slice(i, i + itemsPerSlide);
                slides.push(
                  <SwiperSlide key={i}>
                    <div
                      className={gridClasses}
                      style={{
                        gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
                      }}
                    >
                      {group.map((cat, index) => (
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
                            "w-full aspect-square flex flex-col items-center justify-center",
                            "hover:shadow-md hover:bg-blue-50 transition-all duration-200",
                            "min-h-0 !rounded-none cursor-pointer",
                            "!border-none relative z-10 hover:z-20"
                          )}
                          style={{
                            height: "auto",
                            minHeight: "160px",
                            ...getBorderStyle(
                              index,
                              group.length,
                              gridCols,
                              gridRows
                            ),
                          }}
                          bodyStyle={cardBodyStyle}
                        >
                          <div className="w-7 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
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
                          <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 text-center line-clamp-2 px-1">
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
        )}
      </div>
    </Box>
  );
};

export default CategoryMainDashBoard;
