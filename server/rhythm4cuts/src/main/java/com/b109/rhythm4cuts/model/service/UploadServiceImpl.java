package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.GameLog;
import com.b109.rhythm4cuts.model.domain.VoiceLog;
import com.b109.rhythm4cuts.model.repository.GameLogCustomRepository;
import com.b109.rhythm4cuts.model.repository.UploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
@Transactional
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

    private final S3UploadService s3UploadService;
    private final FilmServiceImpl filmServiceImpl;
    private final UploadRepository uploadRepository;
    private final GameLogCustomRepository gameLogCustomRepository;

    @Override
    public void saveUserAudio(MultipartFile multipartFile, int gameSeq, int userSeq) throws IOException {

        String fileName = filmServiceImpl.generateFileName(multipartFile.getOriginalFilename());
        String fileUrl = s3UploadService.saveVoiceFile(multipartFile, fileName);
        GameLog gameLog = gameLogCustomRepository.selectGameLog(gameSeq, userSeq);

        System.out.println("file 이름: " + fileName);
        System.out.println("file Url: " + fileUrl);

        VoiceLog voiceLog = new VoiceLog();
        voiceLog.setVoiceFile(fileName);
        voiceLog.setVoiceUrl(fileUrl);
        voiceLog.setGameLog(gameLog);

        uploadRepository.insertVoiceLog(voiceLog);

        // Python Flaks 서버로 multipartFile 전송 Start

//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//        File tempFile = File.createTempFile("temp-", multipartFile.getOriginalFilename());
//        Path filePath = tempFile.toPath();
//        Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//        FileSystemResource resource = new FileSystemResource(tempFile);
//
//        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//        body.add("file", resource);
//
//        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
//
//        String pythonUrl = "https://i9b109.p.ssafy.io/score"; // Python Flask 서버의 URL
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<String> response = restTemplate.postForEntity(pythonUrl, requestEntity, String.class);

        // Python Flaks 서버로 multipartFile 전송 End
    }
}
