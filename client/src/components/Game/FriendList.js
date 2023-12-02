import { List, ListItem, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useEffect, useState } from 'react';

function FriendList({ userSeq, refreshCounter }) {

  //친구 목록 가져오는 함수
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `https://i9b109.p.ssafy.io:8443/friend/list/` + userSeq, {
          headers: {
            Authorization: "Bearer " + getCookie("access"),
          },
        });

        const fetchedFriends = response.data.data;
        setFriends(fetchedFriends);

      } catch (error) {
        console.error("친구목록 가져오는데 에러생김 :", error);
      }
    };

    fetchFriends();
  }, [userSeq, refreshCounter]);

  // 친구를 온라인 상태와 이름으로 정렬합니다
  const sortedFriends = [...friends].sort((a, b) => {
    if (a.isOnline === b.isOnline) {
      // 두 친구의 온라인 상태가 동일한 경우 이름으로 정렬합니다
      return a.name.localeCompare(b.name);
    } else if (a.isOnline) {
      // 친구 'a'가 온라인 상태이고 'b'는 아닌 경우, 'a'가 먼저 옵니다
      return -1;
    } else {
      // 친구 'b'가 온라인 상태이고 'a'는 아닌 경우, 'b'가 먼저 옵니다
      return 1;
    }
  });

  return (
    <List>
      {sortedFriends.map((friend, index) => (
        <ListItem key={index}>
          <Typography
            variant="body1"
            style={{ color: "#ffffff", fontFamily: "Ramche" }}
            component="span"
          >
            {friend.isOnline ? "🟢" : "⚫"} {friend.name}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}

export default FriendList;