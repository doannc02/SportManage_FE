import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import PropTypes from "prop-types";

// Danh sách ảnh fallback
const fallbackImages = [
  "https://picsum.photos/id/1015/400/200",
  "https://picsum.photos/id/1016/400/200",
  "https://picsum.photos/id/1020/400/200",
  "https://picsum.photos/id/1024/400/200",
  "https://picsum.photos/id/1025/400/200",
];

// Hàm chọn ngẫu nhiên 1 ảnh fallback
const getFallbackImage = () => {
  const index = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[index];
};

export const ProductSlider = ({ products }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-3xl text-center">
        Top những sản phẩm bán chạy nhất
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={2}
        slidesPerView={4}
        navigation
        // pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
      >
        {(products ?? []).map((product, index) => {
          let imageSrc = "";

          if (product?.Images?.length > 0) {
            imageSrc = product.Images[0];
          } else if (
            product?.Variants?.length > 0 &&
            product.Variants[0]?.Images?.length > 0
          ) {
            imageSrc = product.Variants[0].Images[0];
          } else {
            imageSrc = getFallbackImage();
          }

          return (
            <SwiperSlide key={product.Id ?? index}>
              <Card
                sx={{
                  maxWidth: 300,
                  minHeight: 370,
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 12px 0 rgba(0,0,0.07,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={imageSrc}
                  alt={product.Name || "Product image"}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    background: "#f5f5f5",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      color: "#222",
                    }}
                  >
                    {product.Name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      fontSize: 14,
                    }}
                  >
                    {product.Description}
                  </Typography>

                  {product?.Variants?.[0] && (
                    <Typography
                      sx={{
                        mt: 1,
                        fontWeight: 700,
                        color: "#1976d2",
                        fontSize: 18,
                      }}
                    >
                      {product.Variants[0].Price.toLocaleString()} VND
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      mt: "auto",
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      background:
                        "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                      boxShadow: "none",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)",
                        boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.15)",
                      },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

ProductSlider.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string,
      Images: PropTypes.arrayOf(PropTypes.string),
      Variants: PropTypes.arrayOf(
        PropTypes.shape({
          Price: PropTypes.number.isRequired,
          Images: PropTypes.arrayOf(PropTypes.string),
        })
      ),
    })
  ),
};
