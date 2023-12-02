import {
  Modal,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { React, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/system";
import FriendListInvite from "../Game/FriendListInvite";
import AddFriend from "./AddFriend"; // 'AddFriend' 모달 컴포넌트를 import 합니다.

const CustomCard = styled(Card)({
  width: "80%",
  maxWidth: "600px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  padding: "20px",
});

const StyledCardContent = styled(CardContent)({
  maxHeight: "400px",
  overflow: "auto",
});

function CreateRoom({ isOpen, handleClose }) {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const handleOpenAddFriendModal = () => setIsAddFriendModalOpen(true);
  const handleCloseAddFriendModal = () => setIsAddFriendModalOpen(false);

  let friends = useSelector((state) => state.GameList_Friend); // 친구 리스트

  return (
    <>
      <Modal open={isOpen} onClose={handleClose}>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            overflow: "auto",
            fontFamily: 'Ramche',
          }}
        >
          <CustomCard>
            {/* 친구추가 모달연결 */}
            <CardActions sx={{ justifyContent: "center", fontFamily: 'Ramche', }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddFriendModal}
                style={{fontFamily: 'Ramche',}}
              >
                친구 추가
              </Button>
            </CardActions>

            {/* 친구 리스트 */}
            <StyledCardContent sx={{ height: "70%", margin: "5%", fontFamily: 'Ramche', }}>
              <FriendListInvite friends={friends} />
            </StyledCardContent>

            {/* 나가기 */}
            <CardActions sx={{ justifyContent: "flex-end", fontFamily: 'Ramche', }}>
              <Button variant="contained" color="primary" onClick={handleClose}>
                Close
              </Button>
            </CardActions>
          </CustomCard>
        </Box>
      </Modal>

      {/* 'AddFriend' 모달 */}
      <AddFriend
        isOpen={isAddFriendModalOpen}
        handleClose={handleCloseAddFriendModal}
      />
    </>
  );
}

export default CreateRoom;
