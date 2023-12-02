package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/upload")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping("/user/audio")
    public ResponseEntity<String> saveUserAudio(
            @RequestParam("audio") MultipartFile multipartFile,
            @RequestParam("gameSeq") int gameSeq,
            @RequestParam("userSeq") int userSeq
    ) {
        try {
            uploadService.saveUserAudio(multipartFile, gameSeq, userSeq);
            return ResponseEntity.ok("Audio saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving audio");
        }
    }
}
