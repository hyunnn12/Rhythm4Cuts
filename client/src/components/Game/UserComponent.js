import { React } from "react";
import { Avatar, Card, Grid } from "@mui/material";

const UserVideoComponent = ({ streamManager }) => {
  function getUserInfo() {
    console.log("user info function");
    console.log(JSON.parse(streamManager.stream.connection.data).clientData);
    return JSON.parse(streamManager.stream.connection.data).clientData;
  }

  // 프로필 이미지
  const profileImagePath = `/images/${getUserInfo().data.profile_img_seq}.png`;

  // 서버데이터 가져올 것
  function getProfilePic(pointSum) {
    if (pointSum <= 2000) {
      return "/images/브론즈.png";
    } else if (pointSum <= 4000) {
      return "/images/실버.png";
    } else if (pointSum <= 6000) {
      return "/images/골드.png";
    } else if (pointSum <= 8000) {
      return "/images/플레.png";
    } else {
      return "/images/다이아.png";
    }
  }

  return (
    <Grid>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={profileImagePath} style={{ height: "30vh" }} />
      </div>
      <div
        style={{
          fontFamily: "Ramche",
          fontSize: "20px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div item xs={3} style={{ marginRight: "10px",fontFamily: "Ramche", }}>
          <Avatar
            src={getProfilePic(getUserInfo().data.score_sum)}
            style={{ width: "40px", height: "40px", flexShrink: 0 }}
          />
        </div>

        <div
          item
          xs={7}
          style={{fontFamily: "Ramche", fontSize: "20px", paddingLeft: "20px"}}
        >
          {getUserInfo().data.nickname}
        </div>
      </div>
    </Grid>
  );
};

export default UserVideoComponent;
