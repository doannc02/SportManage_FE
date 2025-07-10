import { Card, List, Typography, Badge, Space, Divider } from "antd";
import {
  Smartphone,
  CheckCircle,
  LaptopMinimal,
  ChevronRight,
  Columns3Cog,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const deviceData = [
  {
    group: "Máy tính Windows",
    devices: [
      {
        name: "Windows",
        location: "Việt Nam",
        lastActive: "18 thg 6",
        app: "Google Chrome",
        isCurrent: true,
        icon: <LaptopMinimal strokeWidth={1.25} />,
      },
      {
        name: "Windows",
        location: "Hà Nội, Việt Nam",
        lastActive: "18 thg 6",
        app: "Google Chrome",
        isCurrent: false,
        icon: <LaptopMinimal strokeWidth={1.25} />,
      },
    ],
  },
  {
    group: "Điện thoại iPhone",
    devices: [
      {
        name: "iPhone",
        location: "Việt Nam",
        lastActive: "7 phút trước",
        app: "Zalo, iOS Account Manager",
        isCurrent: false,
        icon: <Smartphone strokeWidth={1.25} />,
      },
      {
        name: "iPhone",
        location: "Việt Nam",
        lastActive: "2 giờ trước",
        app: "iOS, Safari",
        isCurrent: false,
        icon: <Smartphone strokeWidth={1.25} />,
      },
    ],
  },
];

export default function Devices() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title
        onClick={() => navigate("/")}
        className="flex gap-2 items-center cursor-pointer"
        level={5}
      >
        <ArrowLeft strokeWidth={1.25} size={18} /> Trở về trang chủ
      </Title>
      <Title className="flex gap-2 items-center" level={3}>
        Các thiết bị của bạn{" "}
        <span>
          <Columns3Cog />
        </span>
      </Title>
      <Text type="secondary">
        Bạn đang đăng nhập hoặc đã đăng nhập trên những thiết bị sau trong 28
        ngày qua.
      </Text>

      {deviceData.map((group, idx) => (
        <Card
          key={idx}
          title={`${group.devices.length} phiên hoạt động trên ${group.group}`}
          style={{ marginTop: 24 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={group.devices}
            renderItem={(device, i) => (
              <List.Item key={i}>
                <List.Item.Meta
                  avatar={
                    <Badge dot={device.isCurrent} offset={[-2, 28]}>
                      {device.icon}
                    </Badge>
                  }
                  title={
                    <Space>
                      <Text strong>{device.name}</Text>
                      {device.isCurrent && (
                        <CheckCircle size={16} color="#52c41a" />
                      )}
                    </Space>
                  }
                  description={
                    <Space wrap size={[8, 4]}>
                      <Text>{device.location}</Text>
                      <Divider type="vertical" />
                      <Text>{device.app}</Text>
                      <Divider type="vertical" />
                      <Text>{device.lastActive}</Text>
                      <Divider type="vertical" />
                      <Link
                        to={"/settings/1"}
                        className="flex gap-2 justify-center items-center"
                      >
                        Xem chi tiết{" "}
                        <span>
                          <ChevronRight size={20} />
                        </span>
                      </Link>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ))}
    </div>
  );
}
