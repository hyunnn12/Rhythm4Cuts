package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.domain.Song;
import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.UserDto;

import java.sql.SQLException;
import java.util.List;

public interface LobbyRepository {

    List<GameInfo> selectLobbyList() throws SQLException;
    GameInfo selectSeqLobby(int gameSeq) throws SQLException;
    List<GameInfo> selectTitleLobbyList(String title) throws SQLException;
    int insertGameRoom(LobbyDto lobbyDto) throws SQLException;
    List<Song> selectSongTitleList(String title) throws SQLException;
    GameInfo selectPw(int gameSeq) throws SQLException;
    void putConnectionId(UserDto userDto) throws SQLException;
}
