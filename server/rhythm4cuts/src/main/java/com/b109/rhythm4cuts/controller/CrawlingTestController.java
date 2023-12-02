package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.SongRankDto;
import com.b109.rhythm4cuts.model.service.MelonService;
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
@RequestMapping("/melon")
@RequiredArgsConstructor
public class CrawlingTestController {

    private final MelonService melonService;

    @GetMapping("/rank")
    public ResponseEntity<?> melonRank() {
        try {

            // 1. 기존 DB에 저장된 데이터 초기화
            melonService.clearMelonChart();

            // 2. 현재 멜론 차트 데이터 크롤링 및 DB 저장
            List<SongRankDto> songRanks = melonService.scrapeAndSaveMelonChart();

            Map<String, Object> res = new HashMap<>();
            res.put("message", "Success");
            res.put("statusCode", 200);
            res.put("data", songRanks);
            
            System.out.println("Melon Chart Crawling Success.");
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Fail");
        res.put("statusCode", 500);

        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
}
