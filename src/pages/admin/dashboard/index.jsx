import React from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { FiBox, FiDollarSign, FiUsers, FiCheckCircle } from "react-icons/fi";
import { Icon } from "@chakra-ui/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  { label: "Doanh thu hôm nay", value: "3.200.000đ", icon: FiDollarSign },
  { label: "Đơn hàng mới", value: "12", icon: FiBox },
  { label: "Khách hàng mới", value: "5", icon: FiUsers },
  { label: "Tỉ lệ hoàn thành", value: "98%", icon: FiCheckCircle },
];

const chartData = [
  { name: "T2", orders: 4 },
  { name: "T3", orders: 7 },
  { name: "T4", orders: 6 },
  { name: "T5", orders: 9 },
  { name: "T6", orders: 10 },
  { name: "T7", orders: 8 },
  { name: "CN", orders: 12 },
];

const bestSellers = [
  { name: "Vợt Yonex Astrox 99", sold: 56, price: "2.200.000đ" },
  { name: "Giày Victor A950", sold: 32, price: "1.600.000đ" },
  { name: "Băng tay Mizuno", sold: 21, price: "120.000đ" },
];

const lowStock = [
  { name: "Quấn cán Yonex", quantity: 3 },
  { name: "Cầu lông Hải Yến", quantity: 5 },
];

export default function AdminDashboard() {
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Bảng điều khiển quản trị
      </Heading>

      {/* KPI Stats */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={6}
      >
        {stats.map((stat, i) => (
          <Stat
            key={i}
            p={4}
            border="1px"
            borderColor={borderColor}
            borderRadius="xl"
            bg={bgCard}
          >
            <Flex align="center" mb={2}>
              <Icon as={stat.icon} boxSize={6} mr={2} />
              <StatLabel>{stat.label}</StatLabel>
            </Flex>
            <StatNumber>{stat.value}</StatNumber>
          </Stat>
        ))}
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
        {/* Chart */}
        <Box
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          bg={bgCard}
        >
          <Text mb={4} fontWeight="bold">
            Thống kê đơn hàng trong tuần
          </Text>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3182ce"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Top Selling */}
        <Box
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          bg={bgCard}
        >
          <Text mb={4} fontWeight="bold">
            Sản phẩm bán chạy
          </Text>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Sản phẩm</Th>
                <Th>Đã bán</Th>
                <Th>Giá</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bestSellers.map((item, i) => (
                <Tr key={i}>
                  <Td>{item.name}</Td>
                  <Td>{item.sold}</Td>
                  <Td>{item.price}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Grid>

      {/* Low Stock */}
      <Box
        mt={6}
        p={4}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        bg={bgCard}
      >
        <Text mb={4} fontWeight="bold">
          Sản phẩm tồn kho thấp
        </Text>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Sản phẩm</Th>
              <Th>Số lượng</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lowStock.map((item, i) => (
              <Tr key={i}>
                <Td>{item.name}</Td>
                <Td>{item.quantity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
