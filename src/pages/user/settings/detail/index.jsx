import { Card, Typography, Space, Divider, List, Button } from "antd";
import { Laptop, MapPin, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function DeviceDetail() {
  const navigate = useNavigate();
  const mockData = [
    {
      icon: "https://www.google.com/chrome/static/images/favicons/favicon-96x96.png",
      app: "Google Chrome",
      note: "Những trình duyệt, ứng dụng và dịch vụ có một số quyền truy cập vào tài khoản của bạn trên thiết bị",
    },
    {
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png",
      app: "Facebook",
      note: "Những trình duyệt, ứng dụng và dịch vụ có một số quyền truy cập vào tài khoản của bạn trên thiết bị",
    },
  ];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Card>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Button onClick={() => navigate(-1)} icon={<ArrowLeft strokeWidth={1.25} size={20}/> }>Trở về</Button>
          <Space align="center" size="large">
            <Laptop size={32} />
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                Windows
              </Title>
              <Text>Hà Nội, Việt Nam</Text>
              <br />
              <Text type="secondary">18 tháng 6, 16:12</Text>
            </div>
          </Space>

          <Text>
            Lần đăng nhập đầu tiên: <b>18 tháng 6</b>
          </Text>

          <Text type="secondary">
            Phiên hoạt động này chỉ được sử dụng trong một thời gian ngắn và gần
            đây không được sử dụng. Phiên hoạt động này có thể an toàn, nhưng
            nếu cảm thấy lo ngại thì bạn có thể đăng xuất.
          </Text>

          <Space>
            <Button type="primary" icon={<LogOut size={16} />}>
              Đăng xuất
            </Button>
          </Space>

          <Divider />

          <Title level={5}>Hoạt động gần đây</Title>
          <List
            itemLayout="horizontal"
            dataSource={[{ location: "Hà Nội, Việt Nam", date: "18 thg 6" }]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<MapPin size={20} />}
                  title={<Text>{item.location}</Text>}
                  description={<Text type="secondary">{item.date}</Text>}
                />
              </List.Item>
            )}
          />

          <Divider />

          <Title level={5}>Trình duyệt, ứng dụng và dịch vụ</Title>
          <List
            itemLayout="horizontal"
            dataSource={mockData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<img src={item.icon} alt={item.app} width={24} />}
                  title={<Text strong>{item.app}</Text>}
                  description={<Text type="secondary">{item.note}</Text>}
                />
              </List.Item>
            )}
          />
        </Space>
      </Card>
    </div>
  );
}
