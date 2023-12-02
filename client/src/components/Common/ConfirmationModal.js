import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>정말로 탈퇴하시겠습니까?</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="contained" onClick={onConfirm}>
            확인
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default ConfirmationModal;
