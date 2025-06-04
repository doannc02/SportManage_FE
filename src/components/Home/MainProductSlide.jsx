import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import {
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent
} from '@mui/material'
import PropTypes from 'prop-types'

// Danh sách ảnh fallback
const fallbackImages = [
    'https://picsum.photos/id/1015/400/200',
    'https://picsum.photos/id/1016/400/200',
    'https://picsum.photos/id/1020/400/200',
    'https://picsum.photos/id/1024/400/200',
    'https://picsum.photos/id/1025/400/200'
]

// Hàm chọn ngẫu nhiên 1 ảnh fallback
const getFallbackImage = () => {
    const index = Math.floor(Math.random() * fallbackImages.length)
    return fallbackImages[index]
}

export const ProductSlider = ({ products }) => {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={1}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500 }}
        >
            {(products ?? []).map((product, index) => {
                let imageSrc = ''

                if (product?.Images?.length > 0) {
                    imageSrc = product.Images[0]
                } else if (
                    product?.Variants?.length > 0 &&
                    product.Variants[0]?.Images?.length > 0
                ) {
                    imageSrc = product.Variants[0].Images[0]
                } else {
                    imageSrc = getFallbackImage()
                }

                return (
                    <SwiperSlide key={product.Id ?? index}>
                        <Card sx={{ maxWidth: 300, height: '100%', minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={imageSrc}
                                alt={product.Name || 'Product image'}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    mt: 1
                                }}>{product.Name}</Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        mt: 1
                                    }}
                                >
                                    {product.Description}
                                </Typography>

                                {product?.Variants?.[0] && (
                                    <Typography sx={{ mt: 1 }} color="primary">
                                        {product.Variants[0].Price.toLocaleString()} VND
                                    </Typography>
                                )}

                                <Button variant="contained" size="small" sx={{ mt: 'auto' }}>
                                    Xem chi tiết
                                </Button>
                            </CardContent>
                        </Card>

                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}

ProductSlider.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string,
            Images: PropTypes.arrayOf(PropTypes.string),
            Variants: PropTypes.arrayOf(
                PropTypes.shape({
                    Price: PropTypes.number.isRequired,
                    Images: PropTypes.arrayOf(PropTypes.string)
                })
            )
        })
    )
}
