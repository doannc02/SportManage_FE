import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
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
  "https://picsum.photos/id/1015/400/200",
  "https://picsum.photos/id/1016/400/200",
  "https://picsum.photos/id/1020/400/200",
  "https://picsum.photos/id/1024/400/200",
  "https://picsum.photos/id/1025/400/200",
  "https://picsum.photos/id/1015/400/200",
  "https://picsum.photos/id/1016/400/200",
  "https://picsum.photos/id/1020/400/200",
  "https://picsum.photos/id/1024/400/200",
  "https://picsum.photos/id/1025/400/200",
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
    <div className="flex flex-col gap-6 w-full">
      <div className="text-2xl md:text-3xl font-bold text-center mb-2 text-[#222] tracking-tight">
        Top những sản phẩm bán chạy nhất
      </div>
      <Swiper
        slidesPerView={6}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        style={{ padding: "8px 0" }}
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
            <SwiperSlide key={product.Id ?? index} width="100%">
              <Card
                sx={{
                  maxWidth: 180,
                  minHeight: 260,
                  borderRadius: 2.5,
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: "0 8px 24px 0 rgba(25, 118, 210, 0.10)",
                    transform: "translateY(-4px) scale(1.03)",
                  },
                  cursor: "pointer",
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={imageSrc}
                  alt={product.Name || "Product image"}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    background: "#f5f5f5",
                    width: "100%",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    p: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      color: "#222",
                      fontSize: 15,
                      mb: 0.5,
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
                      fontSize: 12.5,
                      mb: 0.5,
                    }}
                  >
                    {product.Description}
                  </Typography>

                  {product?.Variants?.[0] && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontWeight: 700,
                        color: "#e53935",
                        fontSize: 16,
                        letterSpacing: 0.2,
                      }}
                    >
                      {product.Variants[0].Price.toLocaleString()}{" "}
                      <span style={{ fontSize: 12 }}>VND</span>
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      mt: "auto",
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: 13,
                      background:
                        "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                      boxShadow: "none",
                      py: 0.7,
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
    </div >
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
