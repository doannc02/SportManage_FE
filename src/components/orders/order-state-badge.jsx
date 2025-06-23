import { useState } from "react";
import {
  Badge,
  Flex,
  Icon,
  Select,
  IconButton,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { AlertCircle, Edit2, Check, X } from "lucide-react";
import { ORDER_STATES } from "../../const/enum";
import PropTypes from "prop-types";

// Định nghĩa các chuyển trạng thái hợp lệ
const VALID_TRANSITIONS_ADMIN = {
  Pending: ["Confirmed", "Canceled", "Processing"],
  Confirmed: ["Processing", "Canceled"],
  Processing: ["Shipped"],
  //Shipped: ["Delivered", "Canceled", "Returned"],
  //Delivered: ["Returned"],
  Canceled: [],
  //Returned: ["Refunded"],
  //Refunded: [],
  //Receivered: ["Pending"],
  //Sendered: ["Pending"],
};

const OrderStatusBadge = ({
  size = "md",
  variant = "subtle",
  showIcon = true,
  isEditable = false,
  onStatusChange,
  isAdmin = false,
  isShipper = false,
  status,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  const statusInfo = ORDER_STATES[status] || {
    label: status || "Không xác định",
    colorScheme: "gray",
    icon: AlertCircle,
    bgColor: "gray.50",
    borderColor: "gray.200",
  };

  const {
    label,
    colorScheme,
    icon: StatusIcon,
    bgColor,
    borderColor,
  } = statusInfo;

  const iconSizes = {
    sm: 3,
    md: 4,
    lg: 5,
  };

  const badgeStyles = {
    subtle: {
      bg: bgColor,
      color: `${colorScheme}.700`,
      border: "1px solid",
      borderColor: borderColor,
    },
    solid: {
      colorScheme: colorScheme,
    },
    outline: {
      variant: "outline",
      colorScheme: colorScheme,
    },
  };

  // Lấy danh sách trạng thái có thể chuyển đổi dựa trên vai trò
  const getAvailableStatusOptions = () => {
    let availableStatuses = VALID_TRANSITIONS_ADMIN[status] || [];

    // Admin có thể hủy từ bất kỳ trạng thái nào
    if (
      isAdmin &&
      !availableStatuses.includes("Canceled") &&
      status !== "Canceled" &&
      status !== "Refunded" &&
      status === "RequestCancel"
    ) {
      availableStatuses = [...availableStatuses, "Canceled"];
    }

    // Shipper chỉ có thể chuyển từ Shipped -> Delivered hoặc Returned
    if (isShipper) {
      if (status === "Shipped") {
        return ["Delivered", "Returned"];
      }
      return [];
    }

    return availableStatuses;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedStatus(status);
  };

  const handleSave = () => {
    if (selectedStatus !== status && onStatusChange) {
      onStatusChange(selectedStatus);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedStatus(status);
    setIsEditing(false);
  };

  if (isEditing) {
    const availableStatuses = getAvailableStatusOptions();

    return (
      <HStack spacing={2}>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          size="sm"
          width="auto"
          minW="150px"
        >
          {/* Hiển thị trạng thái hiện tại */}
          <option value={status} disabled>
            {ORDER_STATES[status]?.label || status}
          </option>

          {/* Chỉ hiển thị các trạng thái có thể chuyển đổi */}
          {availableStatuses.map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {ORDER_STATES[statusKey]?.label || statusKey}
            </option>
          ))}
        </Select>
        <Tooltip label="Lưu thay đổi">
          <IconButton
            size="sm"
            colorScheme="green"
            variant="ghost"
            icon={<Icon as={Check} boxSize={3} />}
            onClick={handleSave}
          />
        </Tooltip>
        <Tooltip label="Hủy">
          <IconButton
            size="sm"
            colorScheme="red"
            variant="ghost"
            icon={<Icon as={X} boxSize={3} />}
            onClick={handleCancel}
          />
        </Tooltip>
      </HStack>
    );
  }

  return (
    <HStack spacing={2}>
      <Badge
        size={size}
        px={3}
        py={1}
        borderRadius="full"
        fontWeight="medium"
        {...(variant === "subtle"
          ? badgeStyles.subtle
          : variant === "outline"
          ? badgeStyles.outline
          : { colorScheme: colorScheme })}
        {...props}
      >
        <Flex align="center" gap={1}>
          {showIcon && <Icon as={StatusIcon} boxSize={iconSizes[size] || 4} />}
          {label}
        </Flex>
      </Badge>

      {isEditable && (
        <Tooltip label="Thay đổi trạng thái">
          <IconButton
            size="sm"
            variant="ghost"
            colorScheme="gray"
            icon={<Icon as={Edit2} boxSize={3} />}
            onClick={handleEdit}
          />
        </Tooltip>
      )}
    </HStack>
  );
};

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["subtle", "solid", "outline"]),
  showIcon: PropTypes.bool,
  isEditable: PropTypes.bool,
  onStatusChange: PropTypes.func,
  isAdmin: PropTypes.bool,
  isShipper: PropTypes.bool,
};

export default OrderStatusBadge;
