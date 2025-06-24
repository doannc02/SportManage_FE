import {
  AlertCircle,
  Box,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaUserShield,
  FaWallet,
} from "react-icons/fa";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiSettings,
  FiBarChart2,
  FiList,
  FiGift,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
export const DEFAULT_COLOR = "#319795";
export const countiesCitiesEnums = [
  {
    value: "japan",
    label: "Nhật Bản",
    cities: [
      { value: "tokyo", label: "Tokyo" },
      { value: "osaka", label: "Osaka" },
      { value: "kyoto", label: "Kyoto" },
      { value: "hiroshima", label: "Hiroshima" },
      { value: "sapporo", label: "Sapporo" },
    ],
  },
  {
    value: "vietnam",
    label: "Việt Nam",
  },
  {
    value: "malaysia",
    label: "Malaysia",
    cities: [
      { value: "kuala_lumpur", label: "Kuala Lumpur" },
      { value: "george_town", label: "George Town" },
      { value: "johor_bahru", label: "Johor Bahru" },
      { value: "ipoh", label: "Ipoh" },
    ],
  },
  {
    value: "indonesia",
    label: "Indonesia",
    cities: [
      { value: "jakarta", label: "Jakarta" },
      { value: "surabaya", label: "Surabaya" },
      { value: "bandung", label: "Bandung" },
      { value: "medan", label: "Medan" },
    ],
  },
];

export const optionsReason = [
  { value: "Tôi không còn nhu cầu mua hàng nữa", label: "Tôi không còn nhu cầu mua hàng nữa" },
  { value: "Người bán không xử lý đơn đúng hạn", label: "Người bán không xử lý đơn đúng hạn" },
  { value: "Sản phẩm bị lỗi/hỏng hàng", label: "Sản phẩm bị lỗi/hỏng hàng" },
  { value: "Tôi tìm thấy giá tốt hơn ở nơi khác", label: "Tôi tìm thấy giá tốt hơn ở nơi khác" },
  { value: "Tôi muốn thay đổi địa chỉ nhận hàng", label: "Tôi muốn thay đổi địa chỉ nhận hàng" },
  { value: "ordered_by_mTôi đặt nhầm sản phẩm/đơn hàngistake", label: "Tôi đặt nhầm sản phẩm/đơn hàng" },
  { value: "Người bán yêu cầu hủy đơn hàng", label: "Người bán yêu cầu hủy đơn hàng" },
  { value: "Thời gian giao hàng quá lâu", label: "Thời gian giao hàng quá lâu" },
  { value: "Lý do khác", label: "Lý do khác" },
];

export const optionsRejectReason = [
  { value: "already_shipped", label: "Đơn hàng đã được gửi đi" },
  { value: "processing", label: "Đơn hàng đang được xử lý, không thể hủy" },
  {
    value: "customized_product",
    label: "Sản phẩm đã được cá nhân hóa/đặt riêng, không thể hủy",
  },
  { value: "other", label: "Lý do khác" },
];

export const isActiveBrands = [
  { value: true, label: "Còn hoạt động" },
  { value: false, label: "Đã đóng cửa" },
];
export const optionSizeByUnit = {
  1: [
    // Box - Hộp 📦
    { value: "12", label: "Hộp 1 sản phẩm 📦" },
    { value: "13", label: "Hộp 5 sản phẩm 📦" },
    { value: "14", label: "Hộp 10 sản phẩm 📦" },
    { value: "15", label: "Hộp 20 sản phẩm 📦" },
  ],
  2: [
    // Item - Cái 🏸 (vợt, giày, túi)
    { value: "1", label: "3U - (85 - 89g) 🏸" },
    { value: "2", label: "4U - (80 - 84g) 🏸" },
    { value: "3", label: "5U - (75 - 79g) 🏸" },
    { value: "4", label: "6U - (70 - 74g) 🏸" },
    { value: "5", label: "G4 - Chuẩn tay cầm phổ biến ✋" },
    { value: "6", label: "G5 - Tay nhỏ hơn ✋" },
    { value: "7", label: "Size 41 👟" },
    { value: "8", label: "Size 42 👟" },
    { value: "9", label: "Size 43 👟" },
  ],
  3: [
    // Pack - Lốc 🧃 (băng quấn, cầu lông ống nhỏ)
    { value: "10", label: "Chuẩn - Standard 🌀" },
    { value: "11", label: "Dày - Thick 🧵" },
  ],
  4: [
    // Can - Lon 🥤
    { value: "16", label: "250ml 🌀" },
    { value: "17", label: "300ml 🧵" },
  ],
  5: [
    // Roll - Cuộn 🎞️
    { value: "10", label: "Chuẩn - Standard 🌀" },
    { value: "11", label: "Dày - Thick 🧵" },
  ],
  // Các loại đơn vị khác hiện chưa có size cụ thể, có thể mở rộng sau nếu cần
};

export const getOptionsSizeByUnit = (unitId) => {
  if (!unitId) return [];
  return optionSizeByUnit[unitId] || [];
};

export const optionsUnit = [
  { value: "1", label: "Box - Hộp 📦" }, // Dây cước, cầu lông đóng hộp
  { value: "2", label: "Item - Cái 🏸" }, // Vợt, túi, giày
  { value: "3", label: "Pack - Lốc 🧃" }, // Băng keo quấn cán, cầu lông ống
  { value: "4", label: "Can - Lon 🥤" }, // Bình xịt, keo xịt
  { value: "5", label: "Roll - Cuộn 🎞️" }, // Băng dán, dây cước dài
  { value: "6", label: "Set - Bộ 🧰" }, // Bộ phụ kiện, combo sản phẩm
  { value: "7", label: "Tube - Ống 🗞️" }, // Ống cầu lông (shuttlecock tube)
];

export const optionsColor = [
  { value: "red", label: "Đỏ - Red 🔴" },
  { value: "blue", label: "Xanh dương - Blue 🔵" },
  { value: "green", label: "Xanh lá - Green 🟢" },
  { value: "yellow", label: "Vàng - Yellow 🟡" },
  { value: "black", label: "Đen - Black ⚫" },
  { value: "white", label: "Trắng - White ⚪" },
  { value: "orange", label: "Cam - Orange 🟠" },
  { value: "purple", label: "Tím - Purple 🟣" },
  { value: "gray", label: "Xám - Gray 🔘" },
  { value: "pink", label: "Hồng - Pink 🌸" },
  { value: "brown", label: "Nâu - Brown 🟤" },
  { value: "multicolor", label: "Nhiều màu - Multicolor 🌈" },
];

export const groupedAttributeExtension = [
  {
    category: "Balance Point",
    attributes: ["Head Heavy", "Even Balance", "Head Light"],
  },
  {
    category: "Độ cứng thân vợt",
    attributes: ["Flexible", "Medium", "Stiff", "Extra Stiff"],
  },
  {
    category: "Chất liệu",
    attributes: ["Carbon Graphite", "Nano Carbon", "High Modulus Graphite"],
  },
  {
    category: "Chiều dài",
    attributes: ["675 mm", "680 mm"],
  },
];

export const discountTypeEnums = [
  { value: "Percentage", label: "Phần trăm" },
  { value: "FixedAmount", label: "Cố định" },
];

export const paymentMethod = "CashOnDelivery" | "CreditCard" | "EWallet";

export const paymentMethodEnums = [
  {
    value: "CashOnDelivery",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: FaMoneyBillWave,
  },
  {
    value: "CreditCard",
    label: "Thẻ tín dụng / ghi nợ",
    icon: FaCreditCard,
  },
  {
    value: "EWallet",
    label: "Ví điện tử (Momo, ZaloPay...)",
    icon: FaWallet,
  },
];

export const paymentStatusEnums = [
  { value: "Pending", label: "Chờ thanh toán", color: "yellow.600" },
  { value: "Completed", label: "Đã thanh toán", color: "green.600" },
  { value: "Failed", label: "Thanh toán thất bại", color: "red.600" },
  { value: "Refunded", label: "Hoàn tiền", color: "gray.600" },
];

export const ORDER_STATES = {
  Pending: {
    label: "Chờ xử lý",
    colorScheme: "yellow",
    icon: Clock,
    bgColor: "yellow.50",
    borderColor: "yellow.200",
  },
  Confirmed: {
    label: "Đã xác nhận",
    colorScheme: "blue",
    icon: Package,
    bgColor: "blue.50",
    borderColor: "blue.200",
  },
  Processing: {
    label: "Đang chuẩn bị hàng",
    colorScheme: "cyan",
    icon: Box,
    bgColor: "cyan.50",
    borderColor: "cyan.200",
  },
  RequestCancel: {
    label: "Yêu cầu hủy",
    colorScheme: "red",
    icon: XCircle,
    bgColor: "red.50",
    borderColor: "red.200",
  },
  Canceled: {
    label: "Đã hủy",
    colorScheme: "red",
    icon: XCircle,
    bgColor: "red.50",
    borderColor: "red.200",
  },
  Shipped: {
    label: "Đang giao",
    colorScheme: "purple",
    icon: Truck,
    bgColor: "purple.50",
    borderColor: "purple.200",
  },
  Delivered: {
    label: "Đã giao",
    colorScheme: "green",
    icon: CheckCircle,
    bgColor: "green.50",
    borderColor: "green.200",
  },
};

export const TimelineStatusEnum = [
  {
    status: "Pending",
    title: "Đang chờ xử lý",
    description: "Đơn hàng của bạn đang được chờ xử lý",
    admin_description: "Vui lòng bấm sau khi xử lý xong đơn hàng",
    timestamp: null,
    completed: false,
    disabled: false,
  },
  {
    status: "Confirmed",
    title: "Đơn hàng đã được xác nhận",
    description: "Đơn hàng của bạn đã được xác nhận và đang chuẩn bị",
    admin_description: "Vui lòng bấm sau khi đã kiểm tra đầy đủ thông tin",
    timestamp: null,
    completed: false,
    disabled: false,
  },
  {
    status: "Processing",
    title: "Đang chuẩn bị hàng",
    description: "Chúng tôi đang chuẩn bị sản phẩm cho đơn hàng của bạn",
    admin_description: "Vui lòng bấm sau khi chuẩn bị xong đơn hàng",
    timestamp: null,
    completed: false,
    disabled: false,
  },
  {
    status: "Shipped",
    title: "Đang giao hàng",
    description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
    admin_description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
    timestamp: null,
    completed: false,
    disabled: false,
  },
  {
    status: "Delivered",
    title: "Đã giao hàng",
    description: "Đơn hàng đã được giao thành công",
    admin_description: "Đơn hàng đã được giao thành công",
    timestamp: null,
    completed: false,
    disabled: false,
  },
   {
    status: "RequestCancel",
    title: "Yêu cầu hủy",
    description: "Bạn đã gửi yêu cầu hủy đơn hàng này",
    admin_description: "Đơn hàng đang chờ xử lý yêu cầu hủy",
    timestamp: null,
    completed: false,
    disabled: false,
  },
  {
    status: "Canceled",
    title: "Đã hủy",
    description: "Bạn đã hủy đơn hàng này",
    admin_description: "Đơn hàng đã bị hủy bởi khách hàng",
    timestamp: null,
    completed: false,
    disabled: false,
  },
];

export const OrderStateOptions = Object.entries(ORDER_STATES).map(
  ([key, value]) => ({
    value: key,
    label: value.label,
    color: value.color,
    icon: value.icon,
  })
);

export const TYPE_ORDER_STATE =
  "Pending" | "Receivered" | "Shipped" | "Sendered" | "Cancelled";

export const LIST_ROLES = ["ADMIN", "SHIPPER", "CUSTOMER", "GUEST"];

export const menuAdminItems = [
  {
    title: "Dashboard",
    icon: <></>,
    path: "/admin",
  },
  {
    title: "Quản lý chung",
    icon: <FiList />,
    path: "/generals",
    submenu: [
      {
        title: "Danh mục sản phẩm",
        path: "/generals/categoryProduct",
        icon: <MdOutlineCategory />,
      },
      { title: "Nhà cung cấp", path: "/generals/supplier" },
      { title: "Thương hiệu", path: "/generals/brand" },
    ],
  },
  {
    title: "Quản lý người dùng",
    icon: <FiUsers />,
    path: "/users",
    submenu: [
      { title: "Danh sách người dùng", path: "/users/list" },
      { title: "Thêm người dùng mới", path: "/users/new" },
      {
        title: "Phân quyền",
        path: "/users/permissions",
        icon: <FaUserShield />,
      },
    ],
  },
  {
    title: "Thương hiệu",
    icon: <FiBox />,
    path: "/brands/list",
  },
  {
    title: "Nhà cung cấp",
    icon: <FiBox />,
    path: "/suppliers/list",
  },
  {
    title: "Danh mục sản phẩm",
    icon: <FiBox />,
    path: "/categories/list",
  },
  {
    title: "Chương trình khuyến mãi",
    icon: <FiGift />,
    path: "/vouchers/list",
  },
  {
    title: "Quản lý đơn hàng",
    icon: <FiList />,
    path: "/order-admin/list",
  },
  {
    title: "Sản phẩm",
    icon: <FiBox />,
    path: "/products/list",
  },
  {
    title: "Báo cáo",
    icon: <FiBarChart2 />,
    path: "/reports",
    submenu: [
      { title: "Doanh thu", path: "/reports/revenue" },
      { title: "Khách hàng", path: "/reports/customers" },
    ],
  },
  {
    title: "Cài đặt",
    icon: <FiSettings />,
    path: "/settings",
  },
  {
    title: "Đăng xuất",
    icon: <FiLogOut />,
  },
];

export const menuShipperItems = [
  { title: "Dashboard", icon: <FiHome />, path: "/shipper" },
  {
    title: "Quản lý đơn hàng",
    icon: <FiList />,
    path: "/order-delivery/list",
  },
  {
    title: "Đăng xuất",
    icon: <FiLogOut />,
  },
];

export const MENU_ENUMS = [
  { value: menuAdminItems, role: "ADMIN" },
  { value: menuShipperItems, role: "SHIPPER" },
];

export const SHIPPING_TIMELINE_STEPS = [
  {
    status: "PickedUp",
    title: "Đã lấy hàng",
    description: "Đơn vị vận chuyển đã lấy hàng từ kho",
    icon: Package,
  },
  {
    status: "InTransit",
    title: "Đang vận chuyển",
    description: "Hàng đang được vận chuyển đến điểm trung chuyển",
    icon: Truck,
  },
  {
    status: "OutForDelivery",
    title: "Đang giao hàng",
    description: "Shipper đang trên đường giao hàng đến bạn",
    icon: MapPin,
  },
  {
    status: "Delivered",
    title: "Đã giao thành công",
    description: "Đơn hàng đã được giao thành công",
    icon: Home,
  },
  {
    status: "Failed",
    title: "Giao hàng thất bại",
    description: "Không thể giao hàng, sẽ thử lại sau",
    icon: AlertCircle,
  },
];
