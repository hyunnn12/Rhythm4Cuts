package com.b109.rhythm4cuts.model.service;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.Region;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class S3UploadService {
    private final AmazonS3Client amazonS3;

    public S3UploadService(AmazonS3Client amazonS3Client) {
        this.amazonS3 = amazonS3Client;
    }

    @Value("${cloud.aws.s3.bucket.img}")
    private String bucket;

    @Value("${cloud.aws.s3.bucket.voice}")
    private String voiceBucket;

    public String saveFile(MultipartFile multipartFile, String fileName) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, fileName, multipartFile.getInputStream(), metadata);

        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public String saveVoiceFile(MultipartFile multipartFile, String fileName) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType("audio/wav");
        System.out.println("우리의 Content Type은: " + multipartFile.getContentType() + ", 하지만 아니쥬?: " + metadata.getContentType());

        amazonS3.putObject(voiceBucket, fileName, multipartFile.getInputStream(), metadata);

        return amazonS3.getUrl(voiceBucket, fileName).toString();
    }
}