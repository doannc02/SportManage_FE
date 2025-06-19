import  { useEffect } from "react";
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
    formatter: (value) => `${value?.toLocaleString() || '0'}đ`,
  },
  {
    label: "Đơn hàng mới",
    icon: FiBox,
    keyRes: "totalNewOrder",
    formatter: (value) => value?.toString() || '0',
  },
  {
    label: "Khách hàng mới",
    icon: FiUsers,
    keyRes: "totalNewCustomer",
    formatter: (value) => value?.toString() || '0',
  },
  {
    label: "Chi phí voucher",
    icon: FiCheckCircle,
    keyRes: "totalGMV",
    formatter: (value) => `${value?.toLocaleString() || '0'}đ`,
  },
  {
    label: "Voucher phát hành",
    icon: FiDollarSign,
    keyRes: "totalVoucher",
    formatter: (value) => `${value?.toLocaleString() || '0'}đ`,
  },
];

const MOCK_BEST_SELLERS = [
  { name: "Vợt Yonex Astrox 99", sold: 56, price: "2.200.000đ" },
  { name: "Giày Victor A950", sold: 32, price: "1.600.000đ" },
  { name: "Băng tay Mizuno", sold: 21, price: "120.000đ" },
];

const MOCK_LOW_STOCK = [
  { name: "Quấn cán Yonex", quantity: 3 },
  { name: "Cầu lông Hải Yến", quantity: 5 },
];

const getDefaultDateRange = () => {
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultEndDate.getDate() - 6);
  return {
    startDate: (defaultStartDate),
    endDate: (defaultEndDate),
  };
};

// Main Dashboard Component
export default function AdminDashboard() {
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  const methodForm = useForm({
    defaultValues: getDefaultDateRange(),
  });

  const navigator = useNavigate();

  const { control, watch } = methodForm;
  const formValues = watch();
  const toast = useToast();

  useEffect(() => {
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

    if(formValues.endDate < formValues.startDate) {
      toast({
        title: "Lỗi ngày không hợp lệ",
        description: "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    
  }, [formValues.startDate, formValues.endDate]);

  const { data, isLoading, isError } = useQueryDataChart(
    {
      startDate: formatOffsetDateTime(formValues?.startDate),
      endDate: formatOffsetDateTime(formValues?.endDate),
    },
    {
      enabled: !!formValues.startDate && !!formValues.endDate && formValues.startDate <= formValues.endDate && formValues.endDate > formValues.startDate,
      refetchOnWindowFocus: false,
    }
  );

  const { data: productsData, isLoading: isProductsLoading } = useQueryListProductInventoryLow()

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
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Bảng điều khiển quản trị
      </Heading>

      <SearchForm
        control={control}
      />

      <StatsGrid 
        stats={STATS_CONFIG} 
        data={data} 
        bgCard={bgCard} 
        borderColor={borderColor} 
      />

      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} mb={6}>
        <OrderChart 
          data={data?.lineChartData} 
          bgCard={bgCard} 
          borderColor={borderColor} 
        />
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
      />
    </Box>
  );
}

// Sub-components
const LoadingSkeleton = () => (
  <Box p={6}>
    <Skeleton height="40px" mb={6} />
    <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={4} mb={6}>
      {STATS_CONFIG.map((_, i) => (
        <Skeleton key={i} height="100px" borderRadius="xl" />
      ))}
    </Grid>
    <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
      <Skeleton height="300px" borderRadius="xl" />
      <Skeleton height="300px" borderRadius="xl" />
    </Grid>
    <Skeleton mt={6} height="200px" borderRadius="xl" />
  </Box>
);

const SearchForm = ({ control }) => (
  <Box as="form" mb={6}>
    <Grid  templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={4} alignItems="center">
      <CoreDatePicker
        control={control}
        name="startDate"
        label="Ngày bắt đầu"
      />
      <CoreDatePicker
        control={control}
        name="endDate"
        label="Ngày kết thúc"
      />
    </Grid>
  </Box>
);

const StatsGrid = ({ stats, data, bgCard, borderColor }) => (
  <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={4} mb={6}>
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
      <StatNumber>{formattedValue}</StatNumber>
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
  >
    <Text mb={4} fontWeight="bold">
      Thống kê đơn hàng
    </Text>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data || []}>
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
);

const BestSellersTable = ({ data, bgCard, borderColor }) => (
  <TableContainer 
    title="Sản phẩm bán chạy"
    bgCard={bgCard}
    borderColor={borderColor}
  >
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Sản phẩm</Th>
          <Th>Đã bán</Th>
          <Th>Giá</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, i) => (
          <Tr key={i}>
            <Td>{item.name}</Td>
            <Td>{item.sold}</Td>
            <Td>{item.price}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

const LowStockTable = ({ data,isLoading, bgCard, onRowClick, borderColor }) => (
  <TableContainer 
    title="Sản phẩm tồn kho thấp"
    bgCard={bgCard}
    borderColor={borderColor}
  >
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Sản phẩm</Th>
          <Th>SKU</Th>
          <Th>Sản phẩm gốc</Th>
          <Th>Thương hiệu</Th>
          <Th>Nhà cung cấp</Th>
          <Th>Số lượng</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading && (
          Array.from({ length: 5 }).map((_, i) => (
            <Tr key={i}>
              <Td colSpan={6}>
                <Skeleton height="20px" />
              </Td>
            </Tr>
          ))
        )}
        {(data ?? []).length === 0 ? (
          <Tr> 
            <Td colSpan={6} textAlign="center">
              <Text color="gray.500">Không có sản phẩm tồn kho thấp</Text>
            </Td>
          </Tr> 
        ) :
        (data ?? []).map((item, i) => (
          <Tr className="hover:cursor-pointer" key={i} onClick={() => onRowClick && onRowClick(item.productParent.id)}>
            <Td>{item.name}</Td>
            <Td>{item.sku}</Td>
            <Td>{item.productParent.name}</Td>
            <Td>{item.brandName}</Td>
            <Td>{item.supplierName}</Td>
            <Td>{item.quantity}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

const TableContainer = ({ title, children, bgCard, borderColor }) => (
  <Box
    p={4}
    borderRadius="xl"
    border="1px"
    borderColor={borderColor}
    bg={bgCard}
  >
    <Text mb={4} fontWeight="bold">
      {title}
    </Text>
    {children}
  </Box>
);