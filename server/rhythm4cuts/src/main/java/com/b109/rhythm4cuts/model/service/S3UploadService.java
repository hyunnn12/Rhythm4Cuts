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

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String saveFile(MultipartFile multipartFile, String fileName) throws IOException {
        System.out.println("[Amazon Test]");
        System.out.println(bucket);
        System.out.println(amazonS3.getRegion());
        System.out.println(amazonS3.getRegionName());

        String originalFilename = multipartFile.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, fileName, multipartFile.getInputStream(), metadata);

        return amazonS3.getUrl(bucket, originalFilename).toString();
    }
}