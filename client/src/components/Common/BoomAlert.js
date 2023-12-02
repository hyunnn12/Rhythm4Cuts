import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import React from "react";

function BoomAlert({ isOpen, onClose }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", fontFamily: 'Ramche', }}
    >
      <div style={{ backgroundColor: "rgba(0, 128, 255, 0.3)", width: "25vw", fontFamily: 'Ramche', }}>
        <DialogTitle
          style={{
            backgroundColor: "rgba(0, 128, 255, 0.2)",
            display: "flex",
            justifyContent: "center",
            fontFamily: 'Ramche',
          }}
        >
          <WarningIcon />
        </DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: 'Ramche',
          }}
        >
          <p style={{ fontFamily: 'Ramche' }}>방이 폭파됐습니다!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus style={{ fontFamily: 'Ramche', }}>
            확인
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default BoomAlert;
