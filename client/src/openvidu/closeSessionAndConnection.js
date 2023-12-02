// closeSessionAndConnection.js
import axios from "axios";

const OPENVIDU_SERVER_URL = "https://i9b109.p.ssafy.io";
const OPENVIDU_SERVER_SECRET = "zlwhsalsrnrWid1234";

export const closeSessionAndConnection = async (sessionId, connectionId) => {
  try {
    // 연결 종료
    await axios.delete(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection/${connectionId}`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
          )}`,
        },
      }
    );
    console.log("연결 종료?");

    // 세션 종료
    await axios.delete(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
          )}`,
        },
      }
    );
    console.log("세션 종료?");

    return "Session and connection closed successfully.";
  } catch (error) {
    console.error(error);
    return "Failed to close session and connection.";
  }
};
