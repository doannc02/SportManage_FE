import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { FaCreditCard, FaMoneyBillWave, FaWallet } from "react-icons/fa";

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
    Pending: { label: 'Chờ xử lý', color: 'yellow', icon: Clock },
    Receivered: { label: 'Đã xác nhận', color: 'blue', icon: Package },
    Shipped: { label: 'Đang giao', color: 'purple', icon: Truck },
    Sendered: { label: 'Đã giao', color: 'green', icon: CheckCircle },
    Cancelled: { label: 'Đã hủy', color: 'red', icon: XCircle }
};