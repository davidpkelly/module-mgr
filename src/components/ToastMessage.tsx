import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export interface ToastMessageProps {
  show: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  show = false,
  onClose,
  message,
  type = "info",
}) => {
  return (
    <ToastContainer position="top-center">
      <Toast
        className="d-inline-block m-1"
        bg={type}
        onClose={onClose}
        show={show}
        autohide
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
