import { Card, Tooltip } from "antd";
import { twMerge } from "tailwind-merge";
import { useQueryCategoryList } from "../../services/admins/categories";
import { Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { BASE_URL } from "../../configs/auth";

const getLogoUrl = (logo) =>
  logo
    ? `${BASE_URL}${logo}`
    : "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";

const data = () => {
  const { data } = useQueryCategoryList({
    keyword: "",
    sizeNumber: 20,
    pageNumber: 0,
  });

  console.log("data ", data);
  return (
    <div className="flex flex-col gap-2">
      <Text textTransform={"uppercase"} textAlign={"center"} size={"28px"}>
        Danh mục sản phẩm
      </Text>
      <div className="mx-auto flex flex-wrap justify-center relative">
        <Swiper
          slidesPerView={1}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="mySwiper"
          style={{ paddingBottom: "32px" }}
        >
          {(() => {
            // Chia mảng thành các nhóm 16 phần tử (8x2)
            const items = data?.items || [];
            const groupSize = 16;
            const slides = [];
            for (let i = 0; i < items.length; i += groupSize) {
              const group = items.slice(i, i + groupSize);
              slides.push(
                <SwiperSlide key={i}>
                  <div className="grid grid-cols-8 grid-rows-2 gap-2">
                    {group.map((cat) => (
                      <Tooltip title={cat.name} key={cat.id}>
                        <Card
                          hoverable
                          className={twMerge(
                            "w-40 min-h-[150px] flex flex-col items-center shadow-md transition-transform duration-200 cursor-pointer bg-white",
                            " hover:shadow-lg"
                          )}
                          bodyStyle={{
                            padding: 24,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={getLogoUrl(cat.logo)}
                            alt={cat.name}
                            style={{ objectFit: "cover", height: "80px", width: "80px" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://godecor.com.vn/wp-content/uploads/2024/08/pngtree-product-line-icon-png-image_9015777.png";
                            }}
                          />
                          <h3 className="text-base font-semibold text-gray-900 text-center mb-2 truncate">
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

export default data;
