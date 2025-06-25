import { Box, Flex, Text, useToast, VStack } from "@chakra-ui/react";
import { Button, Spin, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useQueryOrderDetail } from "../../services/customers/orders";
import { useParams } from "react-router-dom";
import { TimelineStatusEnum } from "../../const/enum";
import dayjs from "dayjs";
import StatusChangeDialog from "./state-change-dialog";
import { useMutation } from "react-query";
import { putOrderState } from "../../services/admins/orders";
import RejectCancelDialogAdmin from "./reject-cancel-dialog-admin";
// Timeline component
const OrderTimelineAdmin = () => {
  const { id } = useParams();
  const toast = useToast();
  const [current, setCurrent] = useState(0);

  const [statusTimeline, setStatusTimeline] = useState([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenRejectDialog, setIsOpenRejectDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const {
    data,
    refetch: refechOrder,
    isLoading: loadingDetail,
  } = useQueryOrderDetail({ id: id });

  const { mutate: updateStatusMutation, isLoading: loadingStatus } =
    useMutation({
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
    const currentStatus = data?.state;

    if (["Canceled", "RequestCancel"].includes(currentStatus)) {
      return true;
    }

    // if (step.status === "Delivered") {
    //   return true;
    // }

    if (currentStatus === "Processing") {
      if (step.status === "Shipped") return false;
      return true;
    }
    if (currentStatus === "Shipped" && step.status === "Delivered") {
      return false;
    }
    if (currentStatus === "Confirmed" && step.status === "Processing") {
      return false;
    }

    if (currentStatus === "Pending" && step.status === "Confirmed") {
      return false;
    }

    if (index <= currentIndex) {
      return true;
    }

    return true;
  };

  const getTimeline = () => {
    const currentStatus = data?.state;

    let fullItems = TimelineStatusEnum.map((step) => {
      let timestamp = null;
      switch (step.status) {
        case "Pending":
          timestamp = data?.orderDate;
          break;
        case "Confirmed":
          timestamp = data?.confirmedDate;
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
        case "RequestCancel":
          timestamp = data?.requestCancelDate;
          break;
        case "Canceled":
          timestamp = data?.canceledDate;
          break;
      }
      return { ...step, timestamp };
    });

    let filteredItems = [...fullItems];
    if (currentStatus === "Canceled" || currentStatus === "RequestCancel") {
      filteredItems = fullItems.filter(
        (step) => !["Shipped", "Delivered"].includes(step.status)
      );
    } else {
      filteredItems = fullItems.filter(
        (step) => !["RequestCancel", "Canceled"].includes(step.status)
      );
    }

    const currentIndex = filteredItems.findIndex(
      (step) => step.status === currentStatus
    );
    setCurrent(currentIndex);

    const updated = filteredItems.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      disabled: getDisabled(index, currentIndex, step),
    }));

    setStatusTimeline(updated);
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
  const onConfirmRejectCancel = async (payload) => {
    await updateStatusMutation({
      ...payload,
      newStatus: "ReasonReject",
    });
    setIsOpenRejectDialog(false);
  };
  useEffect(() => {
    getTimeline();
  }, [data?.state]);

  return (
    <Spin spinning={loadingDetail}>
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
        {data?.state === "RequestCancel" && (
          <Box>
            <Flex gap={2}>
              <Button
                color="danger"
                variant="filled"
                onClick={() => setIsOpenRejectDialog(true)}
              >
                Từ chối hủy
              </Button>
              <Button onClick={onClickCancel}>Xác nhận hủy </Button>
            </Flex>
            <Text fontStyle="italic" fontSize="sm" mt={2}>
              Trong trường hợp khách hàng yêu cầu hủy
            </Text>
          </Box>
        )}
      </VStack>
      <RejectCancelDialogAdmin
        isOpen={isOpenRejectDialog}
        onClose={() => setIsOpenRejectDialog(false)}
        onConfirm={onConfirmRejectCancel}
        order={data}
      />
      <StatusChangeDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        onConfirm={onConfirmStatusChange}
        order={data}
        newStatus={newStatus}
        isLoading={loadingStatus}
      />
    </Spin>
  );
};

export default React.memo(OrderTimelineAdmin);
