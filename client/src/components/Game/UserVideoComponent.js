import { React } from "react";
import OpenViduVideoComponent from "./OvVideo";

import { Avatar, Grid } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useParams } from "react-router-dom";

const UserVideoComponent = ({ streamManager }) => {
  const userSeq = getUserInfo().data.user_seq;
  const [userOrders, setUserOrders] = useState({});
  var { gameSeq } = useParams(); // url에서 추출
  useEffect(() => {
    // userSeq를 기반으로 axios를 통해 Order 정보를 가져온다
    const fetchOrderInfo = async () => {
      try {
        const response = await axios.get(
          `https://i9b109.p.ssafy.io:8443/wait/order/${gameSeq}`,
          {
            headers: {
              Authorization: "Bearer " + getCookie("access"),
            },
          }
        );

        const sortedOrderList = response.data
          .slice()
          .sort((a, b) => a.userSeq - b.userSeq);
        const orderMap = {};
        sortedOrderList.forEach((item, index) => {
          orderMap[item.userSeq] = index + 1; // +1을 해서 1부터 시작하는 order 값 부여
        });
        setUserOrders(orderMap);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderInfo();
  }, []);

  function getUserInfo() {
    // console.log("user info function");
    // console.log(JSON.parse(streamManager.stream.connection.data).clientData);
    return JSON.parse(streamManager.stream.connection.data).clientData;
  }
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
    <div>
      <div>
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
        </div>
        <div
          style={{
            fontFamily: "Ramche",
            fontSize: "20px",
            color: "white",
            margin: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item xs={3} style={{ marginRight: "10px" }}>
            <Avatar
              src={getProfilePic(getUserInfo().data.score_sum)}
              style={{ width: "40px", height: "40px", flexShrink: 0 }}
            />
          </Grid>

          <Grid
            item
            xs={7}
           
            style={{ fontSize: "20px",  fontFamily: "Ramche", }}
          >
            {/* {getUserInfo().data.user_seq}  */}
            {userOrders[userSeq] ? (
              <>{userOrders[userSeq]} 번째</>
            ) : (
              "Loading..."
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default UserVideoComponent;
