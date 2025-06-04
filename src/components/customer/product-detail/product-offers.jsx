import { Box, Text, List, ListItem, ListIcon, Heading } from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

export const ProductOffers = () => {
    return (
        <Box border="1px solid" borderColor="orange.300" rounded="md" p={4} mt={4}>
            <Heading size="md" mb={2} color="orange.500">
                🎁 ƯU ĐÃI
            </Heading>
            <List spacing={2} mb={4}>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Tặng 2 Quấn cán vợt Cầu Lông: <Text as="span" color="red.500">VNB 001, VS002</Text> hoặc <Text as="span" color="red.500">Joto 001</Text>
                </ListItem>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Sản phẩm cam kết chính hãng
                </ListItem>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Một số sản phẩm sẽ được tặng bao đơn hoặc bao nhung bảo vệ vợt
                </ListItem>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Thanh toán sau khi kiểm tra và nhận hàng (Giao khung vợt)
                </ListItem>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Bảo hành chính hãng theo nhà sản xuất (Trừ hàng nội địa, xách tay)
                </ListItem>
            </List>

            <Box mt={4} pl={2} borderLeft="4px solid" borderColor="red.400">
                <Text fontWeight="bold" color="orange.500" mb={2}>
                    🎁 Ưu đãi thêm khi mua sản phẩm tại <Text as="span" color="red.600">VNB Premium</Text>
                </Text>
                <List spacing={2}>
                    <ListItem>
                        <ListIcon as={InfoIcon} color="green.500" />
                        Sơn logo mặt vợt miễn phí
                    </ListItem>
                    <ListItem>
                        <ListIcon as={InfoIcon} color="teal.500" />
                        Bảo hành lưới đan trong 72 giờ
                    </ListItem>
                    <ListItem>
                        <ListIcon as={InfoIcon} color="blue.500" />
                        Thay gen vợt miễn phí trọn đời
                    </ListItem>
                    <ListItem>
                        <ListIcon as={InfoIcon} color="purple.500" />
                        Tích lũy điểm thành viên <Text as="span" fontWeight="bold">Premium</Text>
                    </ListItem>
                    <ListItem>
                        <ListIcon as={InfoIcon} color="orange.400" />
                        <Text as="span" color="red.500">Voucher giảm giá</Text> cho lần mua hàng tiếp theo
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};
