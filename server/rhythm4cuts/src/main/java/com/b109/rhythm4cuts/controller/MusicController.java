package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.SongDto;
import com.b109.rhythm4cuts.model.service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;

    // API 1. 영상 url를 저장하고 Youtube Link를 통해 영상 id값, 제목, 가수 추출하여 저장하는 메서드
    @PostMapping("/add")
    public ResponseEntity<?> addYoutubeMusic(@RequestBody SongDto songDto) {
        try {
            musicService.saveMusic(songDto.getYoutubeId(), songDto.getUrl());
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Fail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // API 2. DB에 저장된 노래 영상 링크, 제목, 가수를 전달하는 메서드
    @GetMapping("/play/{songSeq}")
    public ResponseEntity<?> playMusic(@PathVariable("songSeq") int songSeq) {

        SongDto songDto = musicService.selectSong(songSeq);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", songDto);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // API 3. DB에 저장된 모든 노래 리스트를 출력
    @GetMapping
    public ResponseEntity<?> selectAllList() {

        List<SongDto> songDtos = musicService.selectAll();

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Success");
        res.put("statusCode", 200);
        res.put("data", songDtos);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
