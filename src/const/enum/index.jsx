import { Box, CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { FaCreditCard, FaMoneyBillWave, FaUserShield, FaWallet } from "react-icons/fa";
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

export const optionSizeByUnit = {
    "1": [ // Box - Hộp 📦
        { value: "12", label: "Hộp 1 sản phẩm 📦" },
        { value: "13", label: "Hộp 5 sản phẩm 📦" },
        { value: "14", label: "Hộp 10 sản phẩm 📦" },
        { value: "15", label: "Hộp 20 sản phẩm 📦" },
    ],
    "2": [ // Item - Cái 🏸 (vợt, giày, túi)
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
    "3": [ // Pack - Lốc 🧃 (băng quấn, cầu lông ống nhỏ)
        { value: "10", label: "Chuẩn - Standard 🌀" },
        { value: "11", label: "Dày - Thick 🧵" },
    ],
    "4": [ // Can - Lon 🥤
        { value: "16", label: "250ml 🌀" },
        { value: "17", label: "300ml 🧵" },
    ],
    "5": [ // Roll - Cuộn 🎞️
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
    { value: "1", label: "Box - Hộp 📦" },        // Dây cước, cầu lông đóng hộp
    { value: "2", label: "Item - Cái 🏸" },       // Vợt, túi, giày
    { value: "3", label: "Pack - Lốc 🧃" },       // Băng keo quấn cán, cầu lông ống
    { value: "4", label: "Can - Lon 🥤" },        // Bình xịt, keo xịt
    { value: "5", label: "Roll - Cuộn 🎞️" },     // Băng dán, dây cước dài
    { value: "6", label: "Set - Bộ 🧰" },         // Bộ phụ kiện, combo sản phẩm
    { value: "7", label: "Tube - Ống 🗞️" },      // Ống cầu lông (shuttlecock tube)
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
        attributes: ["Head Heavy", "Even Balance", "Head Light"]
    },
    {
        category: "Độ cứng thân vợt",
        attributes: ["Flexible", "Medium", "Stiff", "Extra Stiff"]
    },
    {
        category: "Chất liệu",
        attributes: ["Carbon Graphite", "Nano Carbon", "High Modulus Graphite"]
    },
    {
        category: "Chiều dài",
        attributes: ["675 mm", "680 mm"]
    }
];

export const discountTypeEnums = [
    { value: "Percentage", label: "Phần trăm" },
    { value: "FixedAmount", label: "Cố định" }
]

export const paymentMethod =
    "CashOnDelivery" |
    "CreditCard" |
    "EWallet"

export const paymentMethodEnums = [
    {
        value: "CashOnDelivery",
        label: "Thanh toán khi nhận hàng (COD)",
        icon: FaMoneyBillWave
    },
    {
        value: "CreditCard",
        label: "Thẻ tín dụng / ghi nợ",
        icon: FaCreditCard
    },
    {
        value: "EWallet",
        label: "Ví điện tử (Momo, ZaloPay...)",
        icon: FaWallet
    }
]

export const ORDER_STATES = {
    Pending: {
        label: 'Chờ xử lý',
        colorScheme: 'yellow',
        icon: Clock,
        bgColor: 'yellow.50',
        borderColor: 'yellow.200'
    },
    Confirmed: {
        label: 'Đã xác nhận',
        colorScheme: 'blue',
        icon: Package,
        bgColor: 'blue.50',
        borderColor: 'blue.200'
    },
    Processing: {
        label: 'Đang chuẩn bị hàng',
        colorScheme: 'cyan',
        icon: Box,
        bgColor: 'cyan.50',
        borderColor: 'cyan.200'
    },
    Shipped: {
        label: 'Đang giao',
        colorScheme: 'purple',
        icon: Truck,
        bgColor: 'purple.50',
        borderColor: 'purple.200'
    },
    Delivered: {
        label: 'Đã giao',
        colorScheme: 'green',
        icon: CheckCircle,
        bgColor: 'green.50',
        borderColor: 'green.200'
    },
    Canceled: {
        label: 'Đã hủy',
        colorScheme: 'red',
        icon: XCircle,
        bgColor: 'red.50',
        borderColor: 'red.200'
    }
};

export const OrderStateOptions = Object.entries(ORDER_STATES).map(([key, value]) => ({
    value: key,
    label: value.label,
    color: value.color,
    icon: value.icon
}));

export const TYPE_ORDER_STATE = "Pending" | "Receivered" | "Shipped" | "Sendered" | "Cancelled";

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
        title: "Brands",
        icon: <FiBox />,
        path: "/brands/list",
    },
    {
        title: "Suppliers",
        icon: <FiBox />,
        path: "/suppliers/list",
    },
    {
        title: "Categories",
        icon: <FiBox />,
        path: "/categories/list",
    },
    {
        title: "Voucher",
        icon: <FiGift />,
        path: "/vouchers/list",
    },
    {
        title: "Order Management",
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
        path: "/order-delivery/list"
    },
    {
        title: "Đăng xuất",
        icon: <FiLogOut />,
    },]


export const MENU_ENUMS = [
    { value: menuAdminItems, role: "ADMIN" },
    { value: menuShipperItems, role: "SHIPPER" }
]