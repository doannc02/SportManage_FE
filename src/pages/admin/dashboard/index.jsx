import { useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Skeleton,
  useToast,
  Stack, // Import Stack for vertical alignment
  HStack, // Import HStack for horizontal alignment
  useMediaQuery, // Import useMediaQuery for responsive checks
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
import { useQueryDataChart } from "../../../services/admins/dashboard";
import { formatOffsetDateTime } from "../../../helpers/date";
import CoreDatePicker from "../../../components/atoms/CoreDatePicker";
import { useForm } from "react-hook-form";
import { useQueryListProductInventoryLow } from "../../../services/admins/products";
import { useNavigate } from "react-router-dom";

// Constants
const STATS_CONFIG = [
  {
    label: "Doanh thu",
    icon: FiDollarSign,
    keyRes: "totalRevenue",
    formatter: (value) => `${value?.toLocaleString() || "0"}đ`,
  },
  {
    label: "Đơn hàng mới",
    icon: FiBox,
    keyRes: "totalNewOrder",
    formatter: (value) => value?.toString() || "0",
  },
  {
    label: "Khách hàng mới",
    icon: FiUsers,
    keyRes: "totalNewCustomer",
    formatter: (value) => value?.toString() || "0",
  },
  {
    label: "Chi phí voucher",
    icon: FiCheckCircle,
    keyRes: "totalGMV",
    formatter: (value) => `${value?.toLocaleString() || "0"}đ`,
  },
  {
    label: "Voucher phát hành",
    icon: FiDollarSign,
    keyRes: "totalVoucher",
    formatter: (value) => `${value?.toLocaleString() || "0"}đ`,
  },
];

// MOCK data (giữ nguyên)
const MOCK_BEST_SELLERS = [
  { name: "Vợt Yonex Astrox 99", sold: 56, price: "2.200.000đ" },
  { name: "Giày Victor A950", sold: 32, price: "1.600.000đ" },
  { name: "Băng tay Mizuno", sold: 21, price: "120.000đ" },
];

const getDefaultDateRange = () => {
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultEndDate.getDate() - 6);
  return {
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };
};

// Main Dashboard Component
export default function AdminDashboard() {
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Sử dụng useMediaQuery để kiểm tra kích thước màn hình
  const [isSmallerThanMd] = useMediaQuery("(max-width: 768px)"); // true if screen is md or smaller

  const methodForm = useForm({
    defaultValues: getDefaultDateRange(),
  });

  const navigator = useNavigate();

  const { control, watch } = methodForm;
  const formValues = watch();
  const toast = useToast();

  useEffect(() => {
    if (formValues.startDate && formValues.endDate) {
      // Ensure both dates are selected
      if (formValues.startDate > formValues.endDate) {
        toast({
          title: "Lỗi ngày không hợp lệ",
          description: "Ngày bắt đầu không thể lớn hơn ngày kết thúc",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      // This condition is redundant if the first one is true: if startDate > endDate, then endDate < startDate is also true.
      // if(formValues.endDate < formValues.startDate) {
      //   toast({
      //     title: "Lỗi ngày không hợp lệ",
      //     description: "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu",
      //     status: "error",
      //     duration: 5000,
      //     isClosable: true,
      //     position: "top-right",
      //   });
      //   return;
      // }
    }
  }, [formValues.startDate, formValues.endDate, toast]); // Add toast to dependency array

  const { data, isLoading, isError } = useQueryDataChart(
    {
      startDate: formatOffsetDateTime(formValues?.startDate),
      endDate: formatOffsetDateTime(formValues?.endDate),
    },
    {
      // Simplified enabled condition
      enabled:
        !!formValues.startDate &&
        !!formValues.endDate &&
        formValues.startDate <= formValues.endDate,
      refetchOnWindowFocus: false,
    }
  );

  const { data: productsData, isLoading: isProductsLoading } =
    useQueryListProductInventoryLow();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <Box p={6}>
        <Text color="red.500">Error loading dashboard data</Text>
      </Box>
    );
  }

  console.log("Dashboard data:", data);
  return (
    <Box p={{ base: 4, md: 6 }}>
      {" "}
      {/* Adjust padding for smaller screens */}
      <Heading size={{ base: "md", md: "lg" }} mb={6}>
        {" "}
        {/* Adjust heading size */}
        Bảng điều khiển quản trị
      </Heading>
      <SearchForm
        control={control}
        isSmallerThanMd={isSmallerThanMd} // Pass responsive prop
      />
      <StatsGrid
        stats={STATS_CONFIG}
        data={data}
        bgCard={bgCard}
        borderColor={borderColor}
        isSmallerThanMd={isSmallerThanMd} // Pass responsive prop
      />
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} mb={6}>
        {/* OrderChart takes full width on mobile, 2/3 on desktop */}
        <OrderChart
          data={data?.lineChartData}
          bgCard={bgCard}
          borderColor={borderColor}
        />
        {/* BestSellersTable takes full width on mobile, 1/3 on desktop */}
        <BestSellersTable
          data={MOCK_BEST_SELLERS}
          bgCard={bgCard}
          borderColor={borderColor}
        />
      </Grid>
      <LowStockTable
        isLoading={isProductsLoading}
        onRowClick={(id) => navigator(`/products/detail/${id}`)}
        data={productsData ?? []}
        bgCard={bgCard}
        borderColor={borderColor}
        isSmallerThanMd={isSmallerThanMd} // Pass responsive prop
      />
    </Box>
  );
}

// Sub-components

const LoadingSkeleton = () => (
  <Box p={{ base: 4, md: 6 }}>
    <Skeleton height="40px" mb={6} />
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
      gap={4}
      mb={6}
    >
      {STATS_CONFIG.map((_, i) => (
        <Skeleton key={i} height="100px" borderRadius="xl" />
      ))}
    </Grid>
    <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
      <Skeleton height="250px" borderRadius="xl" />{" "}
      {/* Adjusted height for chart skeleton */}
      <Skeleton height="200px" borderRadius="xl" />{" "}
      {/* Adjusted height for table skeleton */}
    </Grid>
    <Skeleton mt={6} height="200px" borderRadius="xl" />
  </Box>
);

const SearchForm = ({ control, isSmallerThanMd }) => (
  <Box as="form" mb={6}>
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
      gap={4}
      alignItems="center"
    >
      {" "}
      {/* Adjusted to 2 columns on desktop for better alignment */}
      <CoreDatePicker control={control} name="startDate" label="Ngày bắt đầu" />
      <CoreDatePicker control={control} name="endDate" label="Ngày kết thúc" />
    </Grid>
  </Box>
);

const StatsGrid = ({ stats, data, bgCard, borderColor, isSmallerThanMd }) => (
  <Grid
    templateColumns={{
      base: "repeat(auto-fit, minmax(150px, 1fr))",
      md: "repeat(5, 1fr)",
    }} // Dynamic columns for mobile, 5 for desktop
    gap={4}
    mb={6}
  >
    {stats.map((stat, i) => (
      <StatCard
        key={i}
        stat={stat}
        value={data?.[stat.keyRes] || 0}
        bgCard={bgCard}
        borderColor={borderColor}
      />
    ))}
  </Grid>
);

const StatCard = ({ stat, value, bgCard, borderColor }) => {
  const formattedValue = stat.formatter(value);

  return (
    <Stat
      p={{ base: 3, md: 4 }} // Adjust padding for mobile
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      bg={bgCard}
    >
      <Flex
        align={{ base: "flex-start", md: "center" }} // Align icon and label
        direction={{ base: "column", md: "row" }} // Stack on mobile
        mb={2}
      >
        <Icon
          as={stat.icon}
          boxSize={{ base: 5, md: 6 }}
          mr={{ base: 0, md: 2 }}
          mb={{ base: 1, md: 0 }}
        />{" "}
        {/* Adjust icon size and margin */}
        <StatLabel fontSize={{ base: "sm", md: "md" }}>
          {stat.label}
        </StatLabel>{" "}
        {/* Adjust label font size */}
      </Flex>
      <StatNumber fontSize={{ base: "lg", md: "2xl" }}>
        {formattedValue}
      </StatNumber>{" "}
      {/* Adjust number font size */}
    </Stat>
  );
};

const OrderChart = ({ data, bgCard, borderColor }) => (
  <Box
    p={4}
    borderRadius="xl"
    border="1px"
    borderColor={borderColor}
    bg={bgCard}
    minH={{ base: "250px", md: "300px" }} // Ensure minimum height for chart
  >
    <Text mb={4} fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
      Thống kê đơn hàng
    </Text>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{ fontSize: "10px" }} />{" "}
        {/* Smaller font for axis labels on mobile */}
        <YAxis style={{ fontSize: "10px" }} />
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
);

const BestSellersTable = ({ data, bgCard, borderColor }) => (
  <TableContainer
    title="Sản phẩm bán chạy"
    bgCard={bgCard}
    borderColor={borderColor}
  >
    <Box overflowX="auto">
      {" "}
      {/* Enable horizontal scrolling for this table */}
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th fontSize={{ base: "xs", md: "sm" }}>Sản phẩm</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>Đã bán</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>Giá</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, i) => (
            <Tr key={i}>
              <Td fontSize={{ base: "sm", md: "md" }}>{item.name}</Td>
              <Td fontSize={{ base: "sm", md: "md" }}>{item.sold}</Td>
              <Td fontSize={{ base: "sm", md: "md" }}>{item.price}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  </TableContainer>
);

const LowStockTable = ({
  data,
  isLoading,
  bgCard,
  onRowClick,
  borderColor,
  isSmallerThanMd,
}) => (
  <TableContainer
    title="Sản phẩm tồn kho thấp"
    bgCard={bgCard}
    borderColor={borderColor}
  >
    {/* Wrap the table in a Box with overflowX="auto" to allow horizontal scrolling on small screens */}
    <Box overflowX="auto" pb={2}>
      {" "}
      {/* Add some padding-bottom for scrollbar visibility */}
      <Table
        size="sm"
        variant="simple"
        minWidth={isSmallerThanMd ? "700px" : "auto"}
      >
        {" "}
        {/* Set a minWidth to force scroll on small screens */}
        <Thead>
          <Tr>
            <Th fontSize={{ base: "xs", md: "sm" }}>Sản phẩm</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>SKU</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>Sản phẩm gốc</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>Thương hiệu</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>Nhà cung cấp</Th>
            <Th fontSize={{ base: "xs", md: "sm" }}>Số lượng</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <Tr key={i}>
                <Td colSpan={6}>
                  <Skeleton height="20px" />
                </Td>
              </Tr>
            ))}
          {(data ?? []).length === 0 && !isLoading ? (
            <Tr>
              <Td colSpan={6} textAlign="center">
                <Text color="gray.500">Không có sản phẩm tồn kho thấp</Text>
              </Td>
            </Tr>
          ) : (
            (data ?? []).map((item, i) => (
              <Tr
                className="hover:cursor-pointer"
                key={i}
                onClick={() => onRowClick && onRowClick(item.productParent.id)}
              >
                <Td fontSize={{ base: "sm", md: "md" }}>{item.name}</Td>
                <Td fontSize={{ base: "sm", md: "md" }}>{item.sku}</Td>
                <Td fontSize={{ base: "sm", md: "md" }}>
                  {item.productParent.name}
                </Td>
                <Td fontSize={{ base: "sm", md: "md" }}>{item.brandName}</Td>
                <Td fontSize={{ base: "sm", md: "md" }}>{item.supplierName}</Td>
                <Td fontSize={{ base: "sm", md: "md" }}>{item.quantity}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  </TableContainer>
);

const TableContainer = ({ title, children, bgCard, borderColor }) => (
  <Box
    p={{ base: 3, md: 4 }} // Adjust padding for mobile
    borderRadius="xl"
    border="1px"
    borderColor={borderColor}
    bg={bgCard}
  >
    <Text mb={4} fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
      {title}
    </Text>
    {children}
  </Box>
);
