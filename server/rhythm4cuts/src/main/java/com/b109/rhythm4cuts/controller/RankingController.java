package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.SongRankDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import com.b109.rhythm4cuts.model.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ranking")
public class RankingController {
    private final RankingService rankingService;
    //노래 종합 랭킹
    @GetMapping("song")
    public ResponseEntity<?> getSongRanking(){
        List<SongRankDto> songRanking = rankingService.getSongRank();

        Map<String, Object> res = new HashMap<>();

        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", songRanking);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //유저 랭킹
    @GetMapping("user")
    public ResponseEntity<?> getUserRanking(){
        List<UserDto> userRanking = rankingService.getUserRank();

        Map<String, Object> res = new HashMap<>();

        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", userRanking);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
