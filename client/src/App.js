import React from "react";
import { Routes, Route } from "react-router-dom"; //Link,
import { Provider } from "react-redux";
import store from "./store";
import { WebSocketProvider } from "./utils/WebSocket/WebSocket";

import Home from "./pages/HomePage/Home";
import Join from "./pages/HomePage/Join";
import Login from "./pages/HomePage/Login";
import Temp from "./pages/HomePage/Temp";

import GameList from "./pages/GamePage/GameList";
import GameWait from "./pages/GamePage/GameWait";
import GamePlay from "./pages/GamePage/GamePlay";
import GameScore from "./pages/GamePage/GameScore";
import GameShot from "./pages/GamePage/GameShot";

import MyPage from "./pages/MyPage/Mypage";
import MyFriend from "./pages/MyPage/MyFriend";
import MyPoint from "./pages/MyPage/MyPoint";
import MyPhoto from "./pages/MyPage/MyPhoto";
import MyModify from "./pages/MyPage/MyModify";

function App() {
  return (
    <WebSocketProvider>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Join" element={<Join />} />
          <Route path="/Temp" element={<Temp />} />

          <Route path="/GameList" element={<GameList />} />
          <Route path="/GameWait/:gameSeq" element={<GameWait />} />
          <Route path="/GamePlay/:gameSeq" element={<GamePlay />} />
          <Route path="/GameScore/:gameSeq" element={<GameScore />} />
          <Route path="/GameShot/:gameSeq" element={<GameShot />} />

          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyFriend" element={<MyFriend />} />
          <Route path="/MyPoint" element={<MyPoint />} />
          <Route path="/MyPhoto" element={<MyPhoto />} />
          <Route path="/MyModify" element={<MyModify />} />
        </Routes>
      </Provider>
    </WebSocketProvider>
  );
}

export default App;
