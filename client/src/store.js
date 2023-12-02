import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { closeSessionAndConnection } from "./openvidu/closeSessionAndConnection";

//방 노래 제목 넘겨주기 위해
const songTitleSlice = createSlice({
  name: "songTitle",
  initialState: "", // 노래 제목의 초기 상태는 빈 문자열로 설정
  reducers: {
    setSongTitle: (state, action) => {
      return action.payload; // 액션의 페이로드로 상태를 업데이트
    },
  },
});

export const { setSongTitle } = songTitleSlice.actions;

// ----------------------------------------------------------------------------------------------------------------
// 방 세션 관리
const initialState = {
  session: null,
  connection: null,
  connectionToken: null,
  // nickname: null,
  gameseq: null,
};

const roomState = createSlice({
  name: "roomState",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
    setConnectionToken: (state, action) => {
      state.connectionToken = action.payload;
    },
    setNickname: (state, action) => {
      state.nickname = action.payload;
    },
    setGameseq: (state, action) => {
      state.gameseq = action.payload;
    },
    // 상태 초기화
    resetRoomState: state => {
      state.session = initialState.session;
      state.connection = initialState.connection;
      state.connectionToken = initialState.connectionToken;
      // state.nickname = initialState.nickname;
      state.gameseq = initialState.gameseq;
    },
  },
});

export const {
  setSession,
  setConnection,
  setConnectionToken,
  setNickname,
  setGameseq,
  resetRoomState,
} = roomState.actions;

// Room 세션 ID를 설정하는 액션 함수
export const setRoomSession = (session) => (dispatch) => {
  dispatch(setSession(session));
};

// Room 세션 ID를 설정하는 액션 함수
export const setUserConnection = connection => dispatch => {
  dispatch(setConnection(connection));
};

// 유저 토큰을 설정하는 액션 함수
export const setUserToken = (userToken) => (dispatch) => {
  dispatch(setConnectionToken(userToken));
};

// --------------------------------------------------------------------------------------------------
// 웹캠 스트림 상태를 저장하는 slice를 생성합니다.
const webcamStreamSlice = createSlice({
  name: "webcamStream",
  initialState: null, // 웹캠 스트림이 없을 때는 null로 초기화합니다.
  reducers: {
    setWebcamStream: (state, action) => {
      return action.payload; // 받아온 웹캠 스트림으로 상태를 업데이트합니다.
    },
  },
});

export const { setWebcamStream } = webcamStreamSlice.actions;

// 방을 종료하는 비동기 액션을 생성합니다.
// 이 액션은 방의 sessionId와 연결의 connectionId를 인수로 받아 OpenVidu 서버에서 세션을 종료하고 이를 반환합니다.
export const closeSession = createAsyncThunk(
  "session/closeSession",
  async ({ sessionId, connectionId }) => {
    await closeSessionAndConnection(sessionId, connectionId);
  }
);
// ----------------------------------------------------------------------------------------------------------------

// 알림 상태를 저장하는 슬라이스
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    hasNotification: false,
  },
  reducers: {
    setHasNotification: (state, action) => {
      state.hasNotification = action.payload;
    },
  },
});

export const { setHasNotification } = notificationSlice.actions;

const MyPage_Friend = createSlice({
  name: "friend",
  initialState: [
    { id: 0, name: "유밍국", point: 10000, playing: "게임중" },
    { id: 1, name: "실버캐슬", point: 8000, playing: "온라인" },
    { id: 2, name: "유밍국", point: 6000, playing: "게임중" },
    { id: 3, name: "최고다 한윤", point: 4000, playing: "게임중" },
    { id: 5, name: "최재드래곤", point: 2000, playing: "오프라인" },
    { id: 6, name: "홍유콩", point: 2000, playing: "오프라인" },
    { id: 7, name: "프젝", point: 2000, playing: "오프라인" },
    { id: 8, name: "마치면", point: 2000, playing: "오프라인" },
    { id: 9, name: "디져따", point: 2000, playing: "오프라인" },
    { id: 10, name: "디져따", point: 2000, playing: "오프라인" },
    { id: 11, name: "디져따", point: 2000, playing: "오프라인" },
    { id: 12, name: "디져따", point: 2000, playing: "오프라인" },
    { id: 13, name: "디져따", point: 2000, playing: "오프라인" },
    { id: 14, name: "디져따", point: 2000, playing: "오프라인" },
    { id: 15, name: "ssafy", point: 2000, playing: "오프라인" },
  ],
  reducers: {},
});

const MyPage_MyInfo = createSlice({
  name: "info",
  initialState: [
    {
      id: 5,
      name: "프로필 사진",
      // value:
    },
  ],
  reducers: {
    // 프로필 사진 수정 action
    updateProfilePic: (state, action) => {
      const item = state.find((item) => item.name === "프로필 사진");
      if (item) {
        item.value = action.payload;
      }
    },
  },
});

export const { updateNickname, updatePassword, updateProfilePic } =
  MyPage_MyInfo.actions;

// GameList : 친구 리스트
let GameList_Friend = createSlice({
  name: "Friend",
  initialState: [
    { name: "Friend 1", isOnline: true },
    { name: "Friend 2", isOnline: false },
    { name: "Friend 3", isOnline: true },
    { name: "Friend 4", isOnline: true },
    { name: "Friend 5", isOnline: false },
    { name: "Friend 6", isOnline: true },
    { name: "Friend 7", isOnline: false },
    { name: "Friend 8", isOnline: true },
    { name: "Friend 9", isOnline: true },
    { name: "Friend 가", isOnline: false },
    { name: "Friend 나", isOnline: true },
    { name: "Friend 다", isOnline: false },
    { name: "Friend 라", isOnline: false },
    { name: "Friend 마", isOnline: true },
    { name: "Friend 바", isOnline: false },
    // More friends here...
  ],
});

// GameWait : 대기방 준비상태 관리
let GameWait_Ready = createSlice({
  name: "Ready",
  initialState: {
    player1: false,
    player2: false,
    player3: false,
    player4: false,
  },
  reducers: {
    toggleReady: (state, action) => {
      const playerId = action.payload;
      state[playerId] = !state[playerId];
    },
  },
});

export const { toggleReady } = GameWait_Ready.actions;

// GameShot : 인생네컷 배경 이미지 4종류
let GameShot_frameImage = createSlice({
  name: "frameImage",
  initialState: [
    "/images/크리스마스.png",
    "/images/Black.jfif",
    "/images/Blue.png",
    "/images/Green.png",
    "/images/Red.png",
    "/images/기본네컷.jpg",
  ],
});

// GameScore : 게임 순위 (나중에 게임 순위 별 유저 이미지로 받아와야함.)
let GameScore_Result = createSlice({
  name: "gameResults",
  initialState: [
    {
      rank: 1,
      nickname: "Player1",
      score: 100 + "점",
      reward: "+" + 200 + "P",
      imgSrc: "/images/잔나비.jfif",
    },
    {
      rank: 2,
      nickname: "Player2",
      score: 80 + "점",
      reward: "+" + 150 + "P",
      imgSrc: "/images/잔나비.jfif",
    },
    {
      rank: 3,
      nickname: "Player3",
      score: 60 + "점",
      reward: "+" + 100 + "P",
      imgSrc: "/images/잔나비.jfif",
    },
    {
      rank: 4,
      nickname: "Player4",
      score: 40 + "점",
      reward: "+" + 0 + "P",
      imgSrc: "/images/잔나비.jfif",
    },
  ],
});

let Music_Rank = createSlice({
  name: "music_rank",
  initialState: [
    {
      rank: 1,
      title: "주저하는 연인들을 위해",
      singer: "잔나비",
    },
    {
      rank: 2,
      title: "퀸카",
      singer: "(여자)아이들",
    },
    {
      rank: 3,
      title: "Super Shy",
      singer: "New Jeans",
    },
    {
      rank: 4,
      title: "UNFORGIVEN",
      singer: "르세라핌",
    },
    {
      rank: 5,
      title: "일어나",
      singer: "김광석",
    },
    {
      rank: 6,
      title: "주저하는 연인들을 위해",
      singer: "잔나비",
    },
    {
      rank: 7,
      title: "퀸카",
      singer: "(여자)아이들",
    },
    {
      rank: 8,
      title: "Super Shy",
      singer: "New Jeans",
    },
    {
      rank: 9,
      title: "UNFORGIVEN",
      singer: "르세라핌",
    },
    {
      rank: 10,
      title: "일어나",
      singer: "김광석",
    },
    {
      rank: 11,
      title: "주저하는 연인들을 위해",
      singer: "잔나비",
    },
    {
      rank: 12,
      title: "퀸카",
      singer: "(여자)아이들",
    },
    {
      rank: 13,
      title: "Super Shy",
      singer: "New Jeans",
    },
    {
      rank: 14,
      title: "UNFORGIVEN",
      singer: "르세라핌",
    },
    {
      rank: 15,
      title: "일어나",
      singer: "김광석",
    },
    {
      rank: 16,
      title: "주저하는 연인들을 위해",
      singer: "잔나비",
    },
    {
      rank: 17,
      title: "퀸카",
      singer: "(여자)아이들",
    },
    {
      rank: 18,
      title: "Super Shy",
      singer: "New Jeans",
    },
    {
      rank: 19,
      title: "UNFORGIVEN",
      singer: "르세라핌",
    },
    {
      rank: 20,
      title: "일어나",
      singer: "김광석",
    },
  ],
});

let User_Rank = createSlice({
  name: "user_rank",
  initialState: [
    {
      rank: 1,
      nickName: "최재드래곤",
      score: 1000,
    },
    {
      rank: 2,
      nickName: "한윤팀장",
      score: 900,
    },
    {
      rank: 3,
      nickName: "실버캐슬",
      score: 800,
    },
    {
      rank: 4,
      nickName: "홍유콩",
      score: 700,
    },
    {
      rank: 5,
      nickName: "최강현",
      score: 600,
    },
    {
      rank: 6,
      nickName: "밍국이",
      score: 500,
    },
    {
      rank: 7,
      nickName: "누군가",
      score: 300,
    },
    {
      rank: 8,
      nickName: "최재드래곤2",
      score: 1000,
    },
    {
      rank: 9,
      nickName: "한윤팀장2",
      score: 900,
    },
    {
      rank: 10,
      nickName: "실버캐슬2",
      score: 800,
    },
    {
      rank: 11,
      nickName: "홍유콩2",
      score: 700,
    },
    {
      rank: 12,
      nickName: "최강현2",
      score: 600,
    },
    {
      rank: 13,
      nickName: "밍국이2",
      score: 500,
    },
    {
      rank: 14,
      nickName: "누군가2",
      score: 300,
    },
  ],
});

export default configureStore({
  reducer: {
    GameShot_frameImage: GameShot_frameImage.reducer,
    GameScore_Result: GameScore_Result.reducer,
    GameWait_Ready: GameWait_Ready.reducer,
    GameList_Friend: GameList_Friend.reducer,
    Music_Rank: Music_Rank.reducer,
    User_Rank: User_Rank.reducer,
    MyPage_Friend: MyPage_Friend.reducer,
    webcamStream: webcamStreamSlice.reducer,
    notification: notificationSlice.reducer,
    roomState: roomState.reducer,
    songTitle: songTitleSlice.reducer,
  },
});
