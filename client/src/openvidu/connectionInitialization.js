// connectionInitialization.js

import axios from "axios";
import store from "../store"; // 리덕스 훅을 이용하여 상태 가져오기
import { setConnectionToken, setConnection } from "../store";
const OPENVIDU_SERVER_URL = "https://i9b109.p.ssafy.io";
const OPENVIDU_SERVER_SECRET = "zlwhsalsrnrWid1234";

export const createConnection = async (connection) => {
  // sessionId 매개변수 삭제
  try {
    // 리덕스 스토어에서 세션 정보를 가져옵니다.
    const session = store.getState().roomState.session;

    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${session}/connection`, // session 변수로 변경
      {},
      {
        headers: {
          Authorization: `Basic ${btoa(
            `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
          )}`,
          "Content-Type": "application/json",
        },
      }
    );


    // 연결 세션&토큰을 리덕스 스토어에 저장합니다.
    if (connection == null) {
      console.log("커넥션이 null 이네!!!")
      store.dispatch(setConnection(response.data.id));
      store.dispatch(setConnectionToken(response.data.token));

    } else{
      console.log("커넥션이 null 이 아니네!")
    }
    // return response.data.id;
    return {
      connection: response.data.id,
      connectionToken: response.data.token,
    };
  } catch (error) {
    console.error("연결할때 에러:" + error);
    return null;
  }
};
