import { Box, Flex, Text, useToast, VStack } from "@chakra-ui/react";
import { Button, Steps } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useQueryOrderDetail } from "../../services/customers/orders";
import { useParams } from "react-router-dom";
import { TimelineStatusEnum } from "../../const/enum";
import dayjs from "dayjs";
import StatusChangeDialog from "./state-change-dialog";
import { useMutation } from "react-query";
import { putOrderState } from "../../services/admins/orders";

// Timeline component
const OrderTimelineAdmin = () => {
  const { id } = useParams();
  const toast = useToast();
  const [current, setCurrent] = useState(0);

  const [statusTimeline, setStatusTimeline] = useState([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const { data, refetch: refechOrder } = useQueryOrderDetail({ id: id });

  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: (data) => putOrderState(data),
    onError: (error) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      refechOrder();
      toast({
        title: `Cập nhật sang trạng thái ${newStatus} thành công`,
        description: "Trạng thái đơn hàng đã được cập nhật",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  const getDisabled = (index, currentIndex, step) => {
    if (index <= currentIndex || step.status === "Delivered") {
      return true;
    }
    if (data?.state === "Processing") {
      if (step.status === "Shipped") {
        return false;
      }
      return false;
    }
    if (step.status === "Shipped") {
      return true;
    }
    return false;
  };
  const getTimeline = () => {
    let items = [];
    let currentStatus = data?.state;
    let isCompleted = true;
    for (const statusDraff of TimelineStatusEnum) {
      items.push({
        ...statusDraff,
      });
    }
    if (currentStatus === "Canceled") {
      const canceledStep = items.find((step) => step.status === "Canceled");
      if (canceledStep) {
        canceledStep.completed = isCompleted;
        canceledStep.disabled = true;
        setStatusTimeline([canceledStep]);
      } else {
        setStatusTimeline([]);
      }
      return;
    }
    if (currentStatus !== "Canceled") {
      items = items.filter((obj) => obj?.status !== "Canceled");
    }
    // Gán lại biến timestamp vào từng bước trong TimelineStatusEnum
    items = items.map((step) => {
      let timestamp = null;
      switch (step.status) {
        case "Pending":
          timestamp = data?.orderDate;
          break;
        case "Processing":
          timestamp = data?.preparingDate;
          break;
        case "Shipped":
          timestamp = data?.shippedDate;
          break;
        case "Delivered":
          timestamp = data?.deliveredDate;
          break;
        case "Canceled":
          timestamp = data?.canceledDate;
          break;
        default:
          break;
      }
      return { ...step, timestamp };
    });
    // Tìm vị trí (index) của trạng thái hiện tại
    const currentIndex = items.findIndex(
      (step) => step.status === currentStatus
    );
    setCurrent(currentIndex);
    // Tạo danh sách các bước timeline, đánh dấu completed = true nếu nằm trước hoặc tại trạng thái hiện tại
    const updatedSteps = items.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      disabled: getDisabled(index, currentIndex, step),
    }));
    setStatusTimeline(updatedSteps);
  };

  const onChange = (value) => {
    setIsOpenDialog(true);
    const findValue = TimelineStatusEnum[value];
    setNewStatus(findValue.status);
  };

  const onClickCancel = () => {
    setIsOpenDialog(true);
    setNewStatus("Canceled");
  };
  const onConfirmStatusChange = async () => {
    await updateStatusMutation({
      orderId: data.id,
      newStatus: newStatus,
    });
    setIsOpenDialog(false);
    setNewStatus("");
  };

  useEffect(() => {
    getTimeline();
  }, [data?.state]);
  return (
    <>
      <VStack align="stretch" spacing={6}>
        <Box mb={4}>
          <Steps
            responsive
            current={current}
            status={data?.state === "Canceled" ? "error" : "process"}
            onChange={onChange}
            items={statusTimeline.map((step) => ({
              title: step?.title,
              description: (
                <Flex direction={"column"}>
                  <Text>{step?.admin_description}</Text>
                  {step?.timestamp && (
                    <Text>
                      {"--"}
                      {dayjs(step.timestamp).format("DD/MM/YYYY")}
                      {"--"}
                    </Text>
                  )}
                </Flex>
              ),
              disabled: step?.disabled,
            }))}
          />
        </Box>
        {(data?.state === "Pending" || data?.state === "Confirmed") && (
          <Box>
            <Button onClick={onClickCancel}>Hủy đơn hàng</Button>
            <Text fontStyle="italic" fontSize="sm" mt={2}>
              Trong trường hợp khách hàng yêu cầu hủy
            </Text>
          </Box>
        )}
      </VStack>
      <StatusChangeDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        onConfirm={onConfirmStatusChange}
        order={data}
        newStatus={newStatus}
      />
    </>
  );
};
OrderTimelineAdmin.propTypes = {
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      title: PropTypes.string,
      description: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default OrderTimelineAdmin;
