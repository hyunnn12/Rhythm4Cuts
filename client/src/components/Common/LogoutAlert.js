import { Modal, Box, Button, Typography } from "@mui/material";

function LogoutAlert({ isOpen, onClose, onConfirm }) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(50, 100, 255, 0.8)",
                    color: "#ffffff",
                    padding: "50px",
                    fontFamily: 'Ramche',
                    
                }}
            >
                <Typography  height={"100px"} width={"400px"} style={{ fontFamily: 'Ramche', marginBottom: "10px",  fontSize: "20px", fontWeight: "bold",  textAlign: "center" }} >
                    로그아웃 하시겠습니까?
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: 'Ramche', }}>
                    <Button onClick={onConfirm} variant="contained"
                        style={{ backgroundColor: "rgba(0, 128, 255, 0.1)", width: "150px", fontFamily: 'Ramche',}}>
                        확인
                    </Button>
                    <Button onClick={onClose} variant="contained" style={{ backgroundColor: "rgba(0, 128, 255, 0.1)", width: "150px", fontFamily: 'Ramche', }}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default LogoutAlert;
