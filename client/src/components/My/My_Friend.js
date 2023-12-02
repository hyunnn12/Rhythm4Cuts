import {
  Paper,
  Typography,
  Avatar,
  Button,
  Pagination,
  Grid,
  Box,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { getCookie } from '../../utils/cookie';
import { userInfo } from '../../apis/userInfo';

function FriendInfo() {
  const [friendData, setFriendData] = useState([]);
  const [userSeq, setUserSeq] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [toDeleteUserSeq, setToDeleteUserSeq] = useState("");

  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const noOfPages = Math.ceil(friendData.length / itemsPerPage);

  function deleteFriend(toUserSeq) {
    setToDeleteUserSeq(toUserSeq);
    setDeleteConfirmationOpen(true);
  }

  useEffect(() => {
    userInfo()
      .then(res => {
        if (res.status === 200) {
          setUserSeq(res.data.user_seq);
        } else {
          console.log("MyFriend_친구 정보 오류")
        }
      })
  }, [])

  // Axios를 사용하여 친구 데이터를 가져옴
  useEffect(() => {
    axios.get(
      `https://i9b109.p.ssafy.io:8443/friend/list/` + userSeq,
      {
        headers: {
          Authorization: "Bearer " + getCookie("access"),
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setFriendData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching friend data:", error);
      });
  }, [userSeq]);

  function getProfilePic(point_sum) {
    if (point_sum <= 2000) {
      return "/images/브론즈.png";
    } else if (point_sum <= 4000) {
      return "/images/실버.png";
    } else if (point_sum <= 6000) {
      return "/images/골드.png";
    } else if (point_sum <= 8000) {
      return "/images/플레.png";
    } else {
      return "/images/다이아.png";
    }
  }

  // 친구 삭제 확인을 클릭한 경우 실행될 함수
  function deleteFriendConfirmed(toUserSeq) {
    axios.delete(
      `https://i9b109.p.ssafy.io:8443/friend/del/${userSeq}/${toUserSeq}`,
      {
        headers: {
          Authorization: "Bearer " + getCookie("access"),
        },
      }
    )
      .then(() => {
        // 삭제 성공 시에 friendData를 업데이트하여 변경된 데이터를 반영
        const updatedFriendData = friendData.filter(item => item.userSeq !== toUserSeq);
        setFriendData(updatedFriendData);
        setDeleteConfirmationOpen(false); // 다이얼로그 닫기
        window.alert("삭제되었습니다.");
      })
      .catch((error) => {
        console.error("Error deleting friend:", error);
        setDeleteConfirmationOpen(false); // 오류 발생 시에도 다이얼로그 닫기
      });
  }

  return (
    <div style={{ width: "80%", height: "100vh", marginLeft: "5%", marginRight: "5%", fontFamily: 'Ramche', }}>
      <Grid container style={{ marginLeft: "10%", fontFamily: 'Ramche', }}>
        <Grid item xs={12} style={{ padding: "20px" }}>
          <Grid container spacing={3}>
            {friendData.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(
              (item, index) => (
                <Grid item xs={6} key={index}>
                  <Paper
                    elevation={3}
                    style={{
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      width: "30vw",
                      fontFamily: 'Ramche',
                    }}
                  >
                    <Avatar
                      src={getProfilePic(item.point_sum)}
                      style={{ width: "3vw", height: "10vh", flexShrink: 0, fontFamily: 'Ramche', }}
                    />
                    <div style={{ flex: 1 }}>
                      <Typography variant="h6" style={{ color: "#ffffff", fontFamily: 'Ramche', }}>
                        이름: {item.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        style={{ color: "#ffffff", fontFamily: 'Ramche', }}
                      >
                        포인트: {item.point}
                      </Typography>

                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteFriend(item.userSeq)}
                      style={{ flexShrink: 0, fontFamily: 'Ramche', }}
                    >
                      삭제
                    </Button>
                  </Paper>
                </Grid>
              )
            )}
          </Grid>

          <Pagination
            count={noOfPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
            shape="rounded"
            sx={{ display: "flex", justifyContent: "center", margin: "1rem 0", fontFamily: 'Ramche', }}
          />
        </Grid>

        <Grid item xs={3} padding={"15px"}>
          {/* Content for the right side column */}
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>친구 삭제 확인</DialogTitle>
        <DialogContent>
          친구를 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteConfirmationOpen(false);
              deleteFriendConfirmed(toDeleteUserSeq);
            }}
            color="primary"
          >
            삭제
          </Button>
          <Button
            onClick={() => setDeleteConfirmationOpen(false)}
            color="primary"
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FriendInfo;