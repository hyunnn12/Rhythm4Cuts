package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.SongDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import com.b109.rhythm4cuts.model.service.LobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lobby")
public class LobbyController {

    private final LobbyService lobbyService;

    // API 1. 대기방 리스트 전체 조회
    @GetMapping("/list")
    public ResponseEntity<?> getLobbyList() throws SQLException {
        List<LobbyDto> lobbyDtos = lobbyService.getLobbyList();

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", lobbyDtos);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 2. 대기방 검색 (방 번호)
    @GetMapping("/gameSeq")
    public ResponseEntity<?> getSeqLobby(@PathVariable("gameSeq") int gameSeq) throws SQLException {
        LobbyDto lobbyDto = lobbyService.getSeqLobby(gameSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", lobbyDto);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 3. 대기방 리스트 검색 (방 제목)
    @GetMapping("/{title}")
    public ResponseEntity<?> getTitleLobbyList(@PathVariable("title") String title) throws SQLException {
        List<LobbyDto> lobbyDtos = lobbyService.getTitleLobbyList(title);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", lobbyDtos);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 4. 방 만들기
    @PostMapping("/room")
    public ResponseEntity<?> addGameroom(@RequestBody LobbyDto lobbyDto) throws SQLException {
        int gameSeq = lobbyService.addGameRoom(lobbyDto);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", gameSeq);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 5. 방 만들기 시, 노래 제목 찾기
    @GetMapping("/search/{title}")
    public ResponseEntity<?> getSongTitle(@PathVariable("title") String title) throws SQLException {
        List<SongDto> songDtos = lobbyService.getSongTitle(title);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", songDtos);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 6. 비밀방 비밀번호 확인
    @PostMapping("/pw")
    public ResponseEntity<?> getPw(@RequestBody LobbyDto lobbyDto) throws SQLException {
        String pw = lobbyService.getPw(lobbyDto.getGameSeq());

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", pw);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 7. 방 입장
    @PutMapping("/enter")
    public ResponseEntity<?> updateConnectionId(@RequestBody UserDto userDto) throws SQLException {
        lobbyService.updateConnectionId(userDto);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 8. 방 입장 (ver.2)
    @GetMapping("/room/{gameSeq}")
    public ResponseEntity<?> enterRoom(@PathVariable int gameSeq) throws Exception {
       lobbyService.enterRoom(gameSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 9. 방 퇴장
    @GetMapping("/room/exit/{gameSeq}")
    public ResponseEntity<?> exitRoom(@PathVariable int gameSeq) throws Exception {
        lobbyService.exitRoom(gameSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
