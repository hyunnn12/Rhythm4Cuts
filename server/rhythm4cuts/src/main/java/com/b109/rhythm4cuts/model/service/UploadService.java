package com.b109.rhythm4cuts.model.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;

@Service
@Transactional
public interface UploadService {
    void saveUserAudio(MultipartFile multipartFile, int gameSeq, int userSeq) throws IOException;
}
