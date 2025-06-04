import { toast } from "react-toastify";
import { ErrorMessage } from "./componets/error";
import { SuccessMessage } from "./componets/success";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";

const CloseButton = ({ closeToast }) => (
  <IconButton size="small" onClick={closeToast}>
    <CloseIcon fontSize="small" />
  </IconButton>
);

export const toastSuccess = (msg, title, onClick) => {
  if (msg) {
    toast(
      <SuccessMessage
        message={msg}
        title={title}
        onClick={onClick ? onClick : undefined}
      />,
      {
        closeButton: CloseButton,
        autoClose: onClick ? false : 5000,
        className: "mui-toast-success"
      }
    );
  }
};

export const errorMsgWithClick = (message, title, onClick) => {
  toast(<ErrorMessage title={title} message={message} onClick={onClick} />, {
    closeButton: CloseButton,
    autoClose: false,
    className: "mui-toast-error"
  });
};

export const toastError = (error, setError) => {
  if (Array.isArray(error) && error.length > 0) {
    error.forEach((item) => {
      if (item && Array.isArray(item.fields) && setError) {
        item.fields.forEach((field) => {
          if (field !== "orgId") {
            setError(field, {
              type: "be",
              message: item.message,
            });
          }
        });
      } else {
        toastError(item.message);
      }
    });
  } else if (typeof error === "string") {
    toast(<ErrorMessage message={error} />, {
      closeButton: CloseButton,
      className: "mui-toast-error",
    });
  } else {
    toast(<ErrorMessage message="Có lỗi xảy ra" />, {
      closeButton: CloseButton,
      className: "mui-toast-error",
    });
  }
};
