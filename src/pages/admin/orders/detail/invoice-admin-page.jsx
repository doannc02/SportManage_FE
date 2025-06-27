import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Divider, Spin, Table } from "antd";
import { ArrowLeft, FileDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryOrderDetail } from "../../../../services/customers/orders";
import { formatDate } from "../../../../helpers/date";
import { paymentMethodEnums } from "../../../../const/enum";

const InvoiceAdminPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQueryOrderDetail({ id: id });
  const currentPaymentMethod = paymentMethodEnums.find(
    (method) => method.value === data?.payment?.method
  );
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  
  const handlePrintPDF = () => {
    const printContents = document.getElementById("print-area")?.innerHTML;

    if (!printContents) return;

    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

    window.location.reload();
  };
  // Hàm tạo mã hóa đơn ngẫu nhiên gồm 10 chữ số
  const generateInvoiceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };
  const invoiceCode = generateInvoiceCode();

  return (
    <Box
      display={"flex"}
      w={"full"}
      gap={2}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={{ base: "left", md: "center" }}
      overflow={"auto"}
    >
      <Box bg={cardBg} w={"full"} borderColor="gray.200" minW={"794px"} p={4}>
        <Box w={"full"} display={"flex"} justifyContent={"space-between"}>
          <HStack
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft
              strokeWidth={1.25}
              size={20}
              onClick={() => navigate(-1)}
            />
            <Heading size="base" color="gray.900">
              Quay lại
            </Heading>
          </HStack>

          <HStack align="flex-start" spacing={3}>
            <Button
              leftIcon={<FileDown strokeWidth={1.25} size={20} />}
              variant="outline"
              onClick={handlePrintPDF}
            >
              Xuất hóa đơn
            </Button>
          </HStack>
        </Box>
      </Box>

      <Spin spinning={isLoading}>
        <div
          className="w-[794px]  overflow-auto bg-[white]"
          id="print-area"
          style={{padding:"30px"}}
        >
          <Heading size="lg" color="gray.900" mb={2}>
            Hóa đơn thanh toán
          </Heading>
          <div className="flex justify-between items-center mb-[24px]">
            <Text fontFamily="mono" fontWeight="medium" lineHeight="relaxed">
              Mã đơn hàng: {data?.id}
            </Text>
            <div>{/* <img src={images.logo} alt='' /> */}</div>
          </div>
          <div className="flex justify-between text-[14px] text-[#0D0D12] w-full">
            <div className="w-[40%]">
              <p className="leading-[24px] text-[#0D0D12] mb-1">
                Thông tin người nhận:
              </p>
              <>
                <p className="leading-[24px] text-[#43495A] text-[14px] font-normal mb-1">
                  {data?.shippingAddress?.receiveName}
                </p>
                <div>
                  <p className="leading-[24px] text-[#43495A] text-[14px] font-normal">
                    {data?.shippingAddress?.phone}
                  </p>
                  <p className="leading-[24px] text-[#43495A] text-[14px] font-normal">
                    {data?.shippingAddress?.addressDetail}
                  </p>
                </div>
              </>
            </div>
            <div className="w-[40%]">
              <p className="leading-[24px] text-end text-[#0D0D12] mb-1">
                Thông tin người bán
              </p>
              <p className="leading-[24px] text-end text-[#43495A] text-[14px] font-normal mb-1">
                Badminton Store Shop
              </p>
              <p className="leading-[24px] text-end text-[#43495A] text-[14px] font-normal mb-1">
                0983030289
              </p>
              <p className="leading-[24px] text-end text-[#43495A] text-[14px] font-normal">
                Tầng 17, sảnh A tòa nhà HH2, số 15 Tố Hữu, Nhân Chính, Thanh
                Xuân, Hà Nội
              </p>
            </div>
          </div>

          <Divider />

          <div className="flex justify-between  flex-wrap">
            <div className="w-[40%]">
              <p className="text-[16px] leading-[24px] mb-[8px] font-normal text-[#0D0D12]">
                Phương thức thanh toán
              </p>
              <p className="text-[14px] leading-[21px] text-[#43495A] flex gap-[10px]">
                {" "}
                {currentPaymentMethod?.icon ? (
                  <currentPaymentMethod.icon size={20} color="gray" />
                ) : null}
                {currentPaymentMethod?.label}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="text-[16px] leading-[24px] mb-[8px] font-normal text-[#0D0D12]">
                Chi tiết hóa đơn
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#808897]">
                    Ngày tạo:
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#808897]">
                    Mã hóa đơn:
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#808897]">
                    Tổng tiền ban đầu:
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#808897]">
                    Giảm giá:
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#808897]">
                    Tổng tiền phải trả:
                  </p>
                </div>
                <div>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#43495A] text-right">
                    {formatDate(new Date())}
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#43495A] text-right">
                    {invoiceCode}
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#43495A] text-right">
                    {data?.subTotal.toLocaleString()} VNĐ
                  </p>{" "}
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#43495A] text-right">
                    -{data?.discountAmount.toLocaleString()} VND
                  </p>
                  <p className="text-[14px] leading-[21px] mb-[8px] text-[#43495A] text-right">
                    {data?.total.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div>
            {data?.orderItems.length > 0 && (
              <div className="overflow-x-auto mb-[24px]">
                <div className="mb-[12px] font-normal text-[20px] leading-[24px] text-[#0D0D12]">
                  Số lượng sản phẩm
                </div>
                <div className="overflow-hidden rounded-[12px] border border-gray-200">
                  <Table
                    dataSource={data.orderItems.map((item, idx) => ({
                      ...item,
                      key: idx,
                    }))}
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Tên sản phẩm",
                        dataIndex: "productName",
                        key: "productName",
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                      {
                        title: "Đơn vị (VNĐ)",
                        dataIndex: "totalPrice",
                        key: "totalPrice",
                        render: (value) => value?.toLocaleString(),
                      },
                    ]}
                  />
                </div>
              </div>
            )}
          </div>

          <Divider />

          <div className="flex justify-between">
            <div className="w-[450px] flex flex-col gap-[15px]">
              <div>
                <div className="text-[20px] leading-[24px] mb-[8px] font-normal text-[#0D0D12]">
                  Điều khoản thanh toán & Thông tin chuyển tiền
                </div>
              </div>
              <div>
                <div>
                  <div className="text-[16px] font-normal leading-[24px] text-[#0D0D12] mb-[12px]">
                    Thông tin chuyển khoản
                  </div>
                  <div className="flex gap-x-[60px]">
                    <div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#808897] mb-[8px]">
                        Ngân hàng:
                      </div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#808897] mb-[8px]">
                        Tên tài khoản:
                      </div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#808897] mb-[8px]">
                        Số tài khoản:
                      </div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#808897] mb-[8px]">
                        Ví VNPAY:
                      </div>
                    </div>
                    <div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#43495A] mb-[8px] text-right">
                        Ngân hàng TMCP Quân đội MB BANK
                      </div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#43495A] mb-[8px] text-right">
                        Badminton Store Shop
                      </div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#43495A] mb-[8px] text-right">
                        202346827068
                      </div>
                      <div className="font-normal text-[14px] leading-[21px] text-[#43495A] mb-[8px] text-right">
                        04782402484030
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="p-[20px] rounded-[12px] bg-[#F7F8FA]">
            <p className="font-normal text-[14px] text-[#43495A] leading-[21px] mb-[10px]">
              Cảm ơn vì đã mua sắm tại Badminton Store, sự ủng hộ của bạn chính
              là động lực để shop ngày càng trở nên hoàn thiện và phát triển hơn
            </p>
            <p className="font-normal text-[14px] text-[#43495A] leading-[21px] mb-[10px]">
              <strong className="text-[#121212]">
                Nếu cần hỗ trợ bất cứ điều gì ?
              </strong>{" "}
              Vui lòng gọi 0378571321 hoặc liên hệ email
              badmintonstore@gmail.com
            </p>
          </div>
        </div>
      </Spin>
    </Box>
  );
};

export default InvoiceAdminPage;
