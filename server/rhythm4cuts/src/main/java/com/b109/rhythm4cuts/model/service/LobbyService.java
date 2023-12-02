package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.SongDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.SQLException;
import java.util.List;

@Service
@Transactional
public interface LobbyService {

    List<LobbyDto> getLobbyList() throws SQLException;
    LobbyDto getSeqLobby(int gameSeq) throws SQLException;
    List<LobbyDto> getTitleLobbyList(String title) throws SQLException;
    int addGameRoom(LobbyDto lobbyDto) throws SQLException;
    List<SongDto> getSongTitle(String title) throws SQLException;
    String getPw(int gameSeq) throws SQLException;
    void updateConnectionId(UserDto userDto) throws SQLException;
    void enterRoom(int gameSeq) throws Exception;
    void exitRoom(int gameSeq) throws Exception;
}
