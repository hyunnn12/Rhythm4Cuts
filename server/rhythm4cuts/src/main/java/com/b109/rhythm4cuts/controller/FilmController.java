package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.FilmDto;
import com.b109.rhythm4cuts.model.dto.FilmResponseDto;
import com.b109.rhythm4cuts.model.service.FilmService;
import com.b109.rhythm4cuts.model.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/film")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FilmController {
    //application properties 수정
    //websecurityconfig 수정
    private final FilmService filmService;
    private final UserService userService;

    // API 1. 데일리 방명록 사진 리스트
    // date: 방명록 조회 날짜 (ex. 2023-07-24)
    @GetMapping("/daily/info/{year}/{month}/{day}/{page}")
    public ResponseEntity<?> dailyPhotoList(@PathVariable int year, @PathVariable int month, @PathVariable int day, @PathVariable int page) {
        List<FilmDto> filmInfos = filmService.getPhotoList(year, month, day, page);

        return new ResponseEntity<>(filmInfos, HttpStatus.OK);
    }

    // API 2. 인생네컷 테두리 전체 조회
    @GetMapping("/border/list")
    public void borderList() {

        // DB의 배경 테이블에 존재하는 모든 이미지 파일들을 불러올 예정
        filmService.getBackgroundList();
    }

    // API 3. 인생네컷 사진 촬영
    @PostMapping(value = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> photoShoot(@ModelAttribute FilmDto filmInfo) throws IOException {
        // 넘어온 사진 정보를 DB에 저장할 예정
        filmService.saveFilm(filmInfo);

        return ResponseEntity.ok("File uploaded success");
    }

    @GetMapping("/photo")
    public ResponseEntity<List<FilmResponseDto>> getPhotos(@RequestParam String email) throws IOException {
        int userSeq = userService.findByEmail(email).getUserSeq();

        List<FilmResponseDto> filmUrls = filmService.getUserPhotoList(userSeq);

        return ResponseEntity.status(200).body(filmUrls);
    }

    @GetMapping("/photo/daily/info/{year}/{month}/{day}/{page}")
    public ResponseEntity<List<FilmResponseDto>> getDailyPhotos(@PathVariable int year, @PathVariable int month, @PathVariable int day, @PathVariable int page) {
        List<FilmResponseDto> filmResponseDtoList = filmService.getDailyPhotoList(year, month, day, page);

        return ResponseEntity.status(200).body(filmResponseDtoList);
    }

    @GetMapping("/photo/private/game/{gameSeq}/rank/{rank}")
    public ResponseEntity<FilmResponseDto> getPrivatePhotos(@PathVariable int gameSeq, @PathVariable int rank) {
        FilmResponseDto filmResponseDto = filmService.getPrivateFilm(rank, gameSeq);
        return ResponseEntity.status(200).body(filmResponseDto);
    }

    @GetMapping("/photo/common/game/{gameSeq}/rank/{rank}")
    public ResponseEntity<FilmResponseDto> getCommonPhotos(@PathVariable int gameSeq, @PathVariable int rank) {
        FilmResponseDto filmResponseDto = filmService.getCommonFilm(rank, gameSeq);
        return ResponseEntity.status(200).body(filmResponseDto);
    }

    @PostMapping(value = "/private/film", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> setPrivateFilm(@ModelAttribute FilmDto filmInfo) throws IOException {
        // 넘어온 사진 정보를 DB에 저장할 예정
        filmService.savePrivateFilm(filmInfo);

        return ResponseEntity.ok("File uploaded success");
    }

    @PostMapping(value = "/common/film", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> setCommonFilm(@ModelAttribute FilmDto filmInfo) throws Exception {
        // 넘어온 사진 정보를 DB에 저장할 예정
        filmService.saveCommonFilm(filmInfo);

        return ResponseEntity.ok("File uploaded success");
    }
}
