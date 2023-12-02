// RoomToken.js
import { createConnection } from "./connectionInitialization";
import { createSession } from "./sessionInitialization";

export const createRoom = async (gameSeq) => {
  try {
    // 세션 초기화
    const sessionResponse = await createSession(gameSeq);

    // 방에 입장하는 사용자의 연결 초기화
    const connectionResponse = await createConnection(sessionResponse.id);

    // sessionResponse.id : 세션의 ID
    // connectionResponse.token : 사용자의 토큰
    return connectionResponse.token;
  } catch (error) {
    console.error(error);
  }
};
