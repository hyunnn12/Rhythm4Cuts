import { Modal, Box, Button, Typography } from "@mui/material";

function MessageAlert({ isOpen, onClose, onConfirm }) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(50, 100, 255, 0.95)",
          color: "#ffffff",
          padding: "50px",
          fontFamily: 'Ramche',
          display: "flex", // 수평 중앙 정렬을 위해 추가
          flexDirection: "column", // 세로 정렬을 위해 추가
          alignItems: "center", // 수직 중앙 정렬을 위해 추가
        }}
      >
        <Typography
          height={"70px"}
          width={"400px"}
          style={{
            fontFamily: 'Ramche',
            marginBottom: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          알림이 없습니다.
        </Typography>

        <Button
          onClick={onClose}
          variant="contained"
          style={{
            backgroundColor: "rgba(0, 128, 255, 0.1)",
            width: "150px",
            fontFamily: 'Ramche',
          }}
        >
          확인
        </Button>
      </Box>
    </Modal>
  );
}

export default MessageAlert;
