package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.exception.RoomFullException;
import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.domain.Song;
import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.SongDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import com.b109.rhythm4cuts.model.repository.LobbyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LobbyServiceImpl implements LobbyService {

    private final LobbyRepository lobbyRepository;

    @Override
    public List<LobbyDto> getLobbyList() throws SQLException {
        List<GameInfo> gameInfos = lobbyRepository.selectLobbyList();
        List<LobbyDto> res = new ArrayList<>();

        gameInfos.forEach(gameInfo -> {
            if(gameInfo.getHeadCount() > 0) {
                res.add(gameInfo.getLobbyDto());
            }
        });

        return res;
    }

    @Override
    public LobbyDto getSeqLobby(int gameSeq) throws SQLException {
        GameInfo gameInfo = lobbyRepository.selectSeqLobby(gameSeq);

        return gameInfo.getLobbyDto();
    }

    @Override
    public List<LobbyDto> getTitleLobbyList(String title) throws SQLException {
        List<GameInfo> gameInfos = lobbyRepository.selectTitleLobbyList(title);
        List<LobbyDto> res = new ArrayList<>();

        gameInfos.forEach(gameInfo -> {
            if(gameInfo.getHeadCount() > 0) {
                res.add(gameInfo.getLobbyDto());
            }
        });

        return res;
    }

    @Override
    public int addGameRoom(LobbyDto lobbyDto) throws SQLException {
        return lobbyRepository.insertGameRoom(lobbyDto);
    }

    @Override
    public List<SongDto> getSongTitle(String title) throws SQLException {
        List<Song> songs = lobbyRepository.selectSongTitleList(title);
        List<SongDto> res = new ArrayList<>();

        songs.forEach(song -> {
            res.add(song.getSongDto());
        });

        return res;
    }

    @Override
    public String getPw(int gameSeq) throws SQLException {
        GameInfo gameInfo = lobbyRepository.selectPw(gameSeq);

        return gameInfo.getPassword();
    }

    @Override
    public void updateConnectionId(UserDto userDto) throws SQLException {
        lobbyRepository.putConnectionId(userDto);
    }

    @Override
    public void enterRoom(int gameSeq) throws Exception {
        GameInfo gameInfo = lobbyRepository.selectSeqLobby(gameSeq);
        if(gameInfo.getHeadCount()>3) {
            throw new RoomFullException("방이 다 찼습니다.");
        }
        int headCount = gameInfo.getHeadCount();
        gameInfo.setHeadCount(headCount + 1);
    }

    @Override
    public void exitRoom(int gameSeq) throws Exception {
        GameInfo gameInfo = lobbyRepository.selectSeqLobby(gameSeq);
        int headCount = gameInfo.getHeadCount();
        gameInfo.setHeadCount(headCount - 1);

    }
}
