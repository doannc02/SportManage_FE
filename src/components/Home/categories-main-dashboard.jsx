import { Card } from "antd";
import { twMerge } from "tailwind-merge";
import { useQueryCategoryList } from "../../services/admins/categories";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react"; // Import useBreakpointValue
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
    sizeNumber: 20, // Fetch enough data to fill multiple slides if needed
    pageNumber: 0,
  });

  // Số cột của grid bên trong mỗi SwiperSlide
  const gridCols = useBreakpointValue({
    base: 2, // grid-cols-2 (2x2 = 4 items per slide)
    sm: 3, // grid-cols-3 (3x2 = 6 items per slide)
    md: 4, // grid-cols-4 (4x2 = 8 items per slide)
    lg: 6, // grid-cols-6 (6x2 = 12 items per slide)
    xl: 8, // grid-cols-8 (8x2 = 16 items per slide)
  });

  // Số hàng cố định trong mỗi slide
  const gridRows = 2;

  // Tổng số item hiển thị trên mỗi slide
  const itemsPerSlide = gridCols * gridRows;

  // Dữ liệu skeleton dựa trên số lượng item trên mỗi slide
  const skeletonItems = Array(itemsPerSlide).fill({});

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={4}
      p={{ base: "1rem", md: "2rem" }} // Responsive padding
      my={8}
      h={"max-content"}
      w={"100%"}
    >
      <Text
        textTransform="uppercase"
        className="mb-4"
        textColor={"#787877"}
        textAlign="center" // Center text for all breakpoints
      >
        Danh mục sản phẩm
      </Text>
      <div className="w-[95%] sm:w-[90%] md:w-[75%] lg:w-[65%] xl:w-[60%] bg-white mx-auto border border-gray-200 rounded-md overflow-hidden">
        {" "}
        {/* Add border, rounded corners, and responsive width */}
        {isLoading ? (
          <Swiper
            slidesPerView={1} // Luôn là 1 slide hiển thị tại một thời điểm
            spaceBetween={0} // Không cần spaceBetween giữa các SwiperSlide nếu nội dung là grid
            modules={[Pagination, Autoplay]}
            className="category-swiper"
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true} // Add loop for continuous carousel
            style={{ paddingBottom: "40px" }} // Add padding for pagination dots
          >
            <SwiperSlide>
              <div
                className={twMerge(
                  "grid gap-px overflow-hidden", // Add gap-px for 1px lines, hide overflow
                  `grid-cols-2`, // Default for base
                  gridCols >= 3 ? "sm:grid-cols-3" : "", // Conditionally add based on gridCols
                  gridCols >= 4 ? "md:grid-cols-4" : "",
                  gridCols >= 6 ? "lg:grid-cols-6" : "",
                  gridCols >= 8 ? "xl:grid-cols-8" : "",
                  "h-auto" // Ensure grid can expand vertically
                )}
                style={{
                  gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`, // Explicitly define 2 rows
                }}
              >
                {skeletonItems.map((_, index) => (
                  <Card
                    key={`skeleton-${index}`}
                    className={twMerge(
                      "w-full aspect-square flex flex-col items-center justify-center",
                      "min-h-0 !rounded-none",
                      "border-none" // Remove default card border
                    )}
                    style={{
                      height: "auto", // Allow height to adjust
                      minHeight: "160px", // Keep a minimum height for consistency
                      borderRight:
                        (index + 1) % gridCols !== 0
                          ? "1px solid #e2e8f0"
                          : "none", // Vertical line
                      borderBottom:
                        index < itemsPerSlide - gridCols
                          ? "1px solid #e2e8f0"
                          : "none", // Horizontal line (only for top rows)
                    }}
                    bodyStyle={{
                      padding: "12px 0px", // Adjusted padding
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      height: "100%", // Ensure body fills card
                      justifyContent: "center",
                    }}
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
          <Swiper
            slidesPerView={1} // Luôn là 1 slide
            spaceBetween={0} // Không cần spaceBetween giữa các slide
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true} // Vòng lặp liên tục
            className="category-swiper"
            style={{ paddingBottom: "40px" }} // Padding cho dấu chấm pagination
          >
            {(() => {
              const items = data?.items || [];
              const slides = [];

              // Chia items thành các nhóm cho từng slide
              for (let i = 0; i < items.length; i += itemsPerSlide) {
                const group = items.slice(i, i + itemsPerSlide);
                slides.push(
                  <SwiperSlide key={i}>
                    <div
                      className={twMerge(
                        "grid gap-px overflow-hidden", // Add gap-px for 1px lines, hide overflow
                        `grid-cols-2`, // Default for base
                        gridCols >= 3 ? "sm:grid-cols-3" : "",
                        gridCols >= 4 ? "md:grid-cols-4" : "",
                        gridCols >= 6 ? "lg:grid-cols-6" : "",
                        gridCols >= 8 ? "xl:grid-cols-8" : "",
                        "h-auto"
                      )}
                      style={{
                        gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`, // Explicitly define 2 rows
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
                            "hover:shadow-sm transition-all duration-200",
                            "min-h-0 !rounded-none",
                            "border-none" // Remove default card border
                          )}
                          style={{
                            height: "auto", // Allow height to adjust
                            minHeight: "160px", // Keep a minimum height for consistency
                            borderRight:
                              (index + 1) % gridCols !== 0
                                ? "1px solid #e2e8f0"
                                : "none", // Vertical line
                            borderBottom:
                              index < group.length - gridCols
                                ? "1px solid #e2e8f0"
                                : "none", // Horizontal line (only for top rows)
                          }}
                          bodyStyle={{
                            padding: "12px 0px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <div className="w-7 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
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
        )}
      </div>
    </Box>
  );
};

export default CategoryMainDashBoard;
