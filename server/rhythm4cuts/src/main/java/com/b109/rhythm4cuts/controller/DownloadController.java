package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.service.FilmService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/download")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DownloadController {

    private final FilmService filmService;
    @Value("${photo.storage.path}")
    private String imageStoragePath;

    @GetMapping("/url/{fileName}")
    public ResponseEntity<?> getUrl(@PathVariable String fileName) throws Exception {
        String filePath = imageStoragePath + fileName;
        UrlResource resource = new UrlResource(Paths.get(filePath).toUri());
        return new ResponseEntity<>(resource, HttpStatus.OK);
    }
}
