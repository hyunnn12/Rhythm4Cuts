package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.WaitGameRequestDto;
import com.b109.rhythm4cuts.model.dto.WaitGameResponseDto;
import com.b109.rhythm4cuts.model.service.WaitRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wait")
public class WaitRoomController {

    private final WaitRoomService waitRoomService;

    // API 1. 대기방(OpenVidu) 정보 조회
    @GetMapping("/info/{gameSeq}")
    public ResponseEntity<?> getWaitRoomInfo(@PathVariable("gameSeq") int gameSeq) {
        LobbyDto lobbyDto = waitRoomService.getWaitRoomInfo(gameSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", lobbyDto);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 2. 대기방 입장
    @PostMapping("/enter")
    public ResponseEntity<?> insertUserGameInfo(@RequestBody Map<String, Object> param) {

        int order = waitRoomService.insertUserGameInfo(param);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", order);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // API 3. 대기방 친구 초대

    // API 4. 대기방 준비 완료
    @GetMapping("/order/{gameSeq}")
    public ResponseEntity<List<WaitGameResponseDto>> waitRoomOrder(@PathVariable int gameSeq) {
        return ResponseEntity.status(200).body(waitRoomService.getWaitRoomOrder(gameSeq));
    }

    // API 5. 대기방 (방장 권한) 게임 시작
    @PostMapping("/ready")
    public ResponseEntity<?> gameWaitReady(@RequestBody WaitGameRequestDto waitGameRequestDto) {
        int gameSeq = waitGameRequestDto.getGameSeq();
        List<Integer> playerSeq = waitGameRequestDto.getPlayerSeq();
        List<Integer> orderList = new ArrayList<>(List.of(1, 2, 3, 4));
        List<Integer> responseList = new ArrayList<>(List.of(-1, -1, -1, -1));
        Collections.shuffle(orderList);
        List<WaitGameResponseDto> waitGameResponseDtos = new ArrayList<>();

        for(int i = 0; i < playerSeq.size(); i++) {
            Map<String, Object> req = new HashMap<>();
            req.put("gameSeq", gameSeq);
            req.put("userSeq", playerSeq.get(i));
            req.put("order", orderList.get(i));


            responseList.set(orderList.get(i) - 1, playerSeq.get(i));

            waitRoomService.insertUserGameInfo(req);

            WaitGameResponseDto waitGameResponseDto = new WaitGameResponseDto();
            waitGameResponseDto.setUserSeq(playerSeq.get(i));
            waitGameResponseDto.setOrder(orderList.get(i) - 1);

            waitGameResponseDtos.add(waitGameResponseDto);
        }

        System.out.println("res / order");
        System.out.println(responseList);
        System.out.println(orderList);

        return ResponseEntity.status(200).body(waitGameResponseDtos);
    }

    // API 6. 대기방 (방장 권한) 강제 퇴장

    // API 7. 대기방 나가기
}
