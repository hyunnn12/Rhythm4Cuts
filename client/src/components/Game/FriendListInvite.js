import { Button, List, ListItem, ListItemText } from "@mui/material";
import React from "react";

// GameWait 창에서 친구 초대 모달에 들어갈 컴포넌트
function FriendList({ friends }) {
  // 먼저 "온라인 상태"에 따라 정렬하고, 같은 "온라인 상태"를 가진 친구들 사이에서 "이름"에 따라 정렬합니다
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

  // "Direct 초대" 버튼 클릭 시 처리할 함수
  const handleInviteClick = (friend) => {
    // 현재는 아무것도 수행하지 않고, 친구 이름을 콘솔에 출력!!
    console.log(`Inviting ${friend.name}...`);
    // 서버가 준비되면 이 부분에 API 호출 등의 로직을 추가할 수 있다.
  };

  return (
    <List>
      {sortedFriends.map((friend, index) => (
        <ListItem key={index}>
          <ListItemText secondary={friend.isOnline ? "🟢" : "⚫"} />
          <ListItemText primary={friend.name} />
          {friend.isOnline && ( // 친구가 온라인 상태인 경우에만 버튼을 표시합니다
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleInviteClick(friend)}
              style={{fontFamily: 'Ramche',}}
            >
              Direct Invite
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );
}

export default FriendList;
