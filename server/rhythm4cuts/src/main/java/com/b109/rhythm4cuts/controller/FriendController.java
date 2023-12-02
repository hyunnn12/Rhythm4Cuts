package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.FriendDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import com.b109.rhythm4cuts.model.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @GetMapping("/info/{userSeq}")
    public ResponseEntity<?> getUserInfo(@PathVariable("userSeq") Integer userSeq) throws Exception {
        UserDto userInfo = friendService.getUserInfo(userSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", userInfo);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    //친구 정보 조회
    @GetMapping("/list/{userSeq}")
    public ResponseEntity<?> getFriendList(@PathVariable("userSeq") Integer userSeq) throws Exception {
        List<UserDto> friendList = friendService.getFriendList(userSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", friendList);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //유저 검색
    @GetMapping("/search/{searchStr}")
    public ResponseEntity<?> getUserInfo(@PathVariable("searchStr") String searchStr) throws Exception {
        List<UserDto> searchList = friendService.userSearch(searchStr);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", searchList);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //친구 추가
    @PostMapping("/confirm")
    public ResponseEntity<?> addFriend(@RequestBody FriendDto requestFriend) throws Exception {
        friendService.addFriend(requestFriend);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //친구 요청한 유저 정보
    @GetMapping("/request/{userSeq}")
    public ResponseEntity<?> getRequestFriendList(@PathVariable("userSeq") Integer userSeq) throws Exception {
        List<UserDto> friendList = friendService.getRequestFriendList(userSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", friendList);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //친구 요청
    @PostMapping("/request")
    public ResponseEntity<?> requestFriend(@RequestBody FriendDto requestFriend) throws Exception {
        System.out.println(requestFriend.getFromUser());
        System.out.println(friendService);
        friendService.requestFriend(requestFriend);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //친구 거절
    @PostMapping("/reject")
    public ResponseEntity<?> rejectFriend(@RequestBody FriendDto requestFriend) throws Exception {
        friendService.rejectFriend(requestFriend);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //친구삭제
    @DeleteMapping("/del/{from}/{to}")
    public ResponseEntity<?> deleteFriend(@PathVariable("from")int fromUserSeq, @PathVariable("to") int toUserSeq) throws Exception {

        friendService.deleteFriend(fromUserSeq, toUserSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
