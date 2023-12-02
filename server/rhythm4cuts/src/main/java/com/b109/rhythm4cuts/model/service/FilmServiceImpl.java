package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.BackGround;
import com.b109.rhythm4cuts.model.domain.GameImage;
import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.BackgroundDto;
import com.b109.rhythm4cuts.model.dto.FilmDto;
import com.b109.rhythm4cuts.model.dto.FilmResponseDto;
import com.b109.rhythm4cuts.model.repository.BackGroundRepository;
import com.b109.rhythm4cuts.model.repository.FilmRepository;
import com.b109.rhythm4cuts.model.repository.GameRepository;
import com.b109.rhythm4cuts.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class FilmServiceImpl implements FilmService {

    private final FilmRepository filmRepository;
    private final UserRepository userRepository;
    private final S3UploadService s3UploadService;
    private final GameRepository gameRepository;
    private final BackGroundRepository backGroundRepository;

    @Value("${photo.storage.path}")
    private String imageStoragePath;

    @Override
    public List<FilmDto> getPhotoList(int year, int month, int day, int page) {
        List<FilmDto> res = new ArrayList<>();
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<GameImage> gameImages = filmRepository.findByDate(year, month, day, pageable);

        gameImages.forEach(gameImage -> {
            res.add(gameImage.getFilmDto());
        });

        return res;
    }

    @Override
    public List<FilmResponseDto> getUserPhotoList(int userSeq) {
        List<GameImage> gameImages = filmRepository.findByUserSeq(userSeq);
        List<FilmResponseDto> filmResponseDtos = new ArrayList<>();

        for(GameImage gameImage : gameImages) {
            FilmResponseDto filmResponseDto = new FilmResponseDto();

            filmResponseDto.setCommonUrl(gameImage.getCommonUrl());
            filmResponseDto.setPrivateUrl(gameImage.getPrivateUrl());
            filmResponseDto.setCreateDate(gameImage.getCreateDate());

            filmResponseDtos.add(filmResponseDto);
        }

        return filmResponseDtos;
    }


    @Override
    public List<BackgroundDto> getBackgroundList() {

        List<BackGround> backGroundList = backGroundRepository.findAll();
        List<BackgroundDto> backGroundDtoList = new ArrayList<>();

        backGroundList.forEach(background -> {
            BackgroundDto backGroundDto = new BackgroundDto();

            backGroundDto.setBackgroundName(background.getBackground_name());
            backGroundDto.setBackgroundSeq(background.getBackgroundSeq());
            backGroundDto.setFileName(background.getFileName());

            backGroundDtoList.add(backGroundDto);
        });

        return backGroundDtoList;
    }

    @Override
    public void saveFilm(FilmDto filmInfo) throws IOException {
        GameImage gameImage = new GameImage();

        User user =  userRepository.findByUserSeq(filmInfo.getUserSeq());
//        GameInfo gameInfo = gameRepository.findByGameSeq(filmInfo.getGameSeq());
//        BackGround backGround = backGroundRepository.findByBackgroundSeq(filmInfo.getBackgroundSeq());
        gameImage.setUser(user);
//        gameImage.setGameInfo(gameInfo);
//        gameImage.setBackGround(backGround);
        gameImage.setGameRank(filmInfo.getPlayerRank());
        gameImage.setCreateDate(LocalDateTime.now());

        //private & common 이미지 파일명 설정
        String privateFilmName = generateFileName(filmInfo.getPrivateFilm().getOriginalFilename());
        String commonFilmName = "total_" + generateFileName(Objects.requireNonNull(filmInfo.getCommonFilm().getOriginalFilename()));

        gameImage.setFileName(privateFilmName);
        gameImage.setTotalFileName(commonFilmName);

//        byte[] privateFileData = filmInfo.getPrivateFilm().getBytes();
//        byte[] commonFileDate = filmInfo.getCommonFilm().getBytes();
        String commonUrl = s3UploadService.saveFile(filmInfo.getCommonFilm(), commonFilmName);
        String privateUrl = s3UploadService.saveFile(filmInfo.getPrivateFilm(), privateFilmName);

        gameImage.setCommonUrl(commonUrl);
        gameImage.setPrivateUrl(privateUrl);

        //s3 url 설정
        filmRepository.save(gameImage);

//        File folder = new File(imageStoragePath);
//        if (!folder.exists()) {
//            folder.mkdirs();
//        }
//
//        Path privateFilePath = Paths.get(imageStoragePath, gameImage.getFileName());
//        Files.write(privateFilePath, privateFileData);
//
//        Path commonFilePath = Paths.get(imageStoragePath, gameImage.getTotalFileName());
//        Files.write(commonFilePath, commonFileDate);

    }

    @Override
    public Resource downFilm(String filmName) throws Exception {
        String file = imageStoragePath + "/" + filmName;
        Path filePath = Paths.get(file);
        Resource resource = new InputStreamResource(Files.newInputStream(filePath));

        return resource;
    }

    @Override
    public List<Resource> downDailyFilm(int year, int month, int day, int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<GameImage> gameImages = filmRepository.findByDate(year, month, day, pageable);
        List<Resource> resources = new ArrayList<>();

        gameImages.forEach(gameImage -> {
            try {
                Resource resource = downFilm(gameImage.getTotalFileName());
                resources.add(resource);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        return resources;
    }

    public List<FilmResponseDto> getDailyPhotoList(int year, int month, int day, int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<GameImage> gameImages = filmRepository.findByDate(year, month, day, pageable);
        List<FilmResponseDto> filmList = new ArrayList<>();

        gameImages.forEach(gameImage -> {
           FilmResponseDto filmResponseDto = new FilmResponseDto();

           filmResponseDto.setPrivateUrl(gameImage.getPrivateUrl());
           filmResponseDto.setCommonUrl(gameImage.getCommonUrl());
           filmResponseDto.setCreateDate(gameImage.getCreateDate());

           filmList.add(filmResponseDto);
        });

        return filmList;
    }

    public String generateFileName(String originalFilename) {
        // 현재 시간 정보
        LocalDateTime now = LocalDateTime.now();

        // 년월일시분초
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String dateTimeStr = now.format(formatter);

        // 8자리 난수 생성
        String randomStr = generateRandomString(8);

        // 확장자 추출 (옵션)
        String fileExtension = "";
        int lastIndex = originalFilename.lastIndexOf('.');
        if (lastIndex >= 0 && lastIndex < originalFilename.length() - 1) {
            fileExtension = originalFilename.substring(lastIndex);
        }

        // 최종 파일 이름: 년월일시분초 + 8자리 난수 + 확장자
        return dateTimeStr + randomStr + fileExtension;
    }

    public String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomString = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            randomString.append(characters.charAt(random.nextInt(characters.length())));
        }
        return randomString.toString();
    }

    public FilmResponseDto getPrivateFilm(int gameRank, int gameSeq) {
        GameImage gameInfo = filmRepository.findByGameRankAndGameInfo(gameRank, gameSeq);
        FilmResponseDto filmResponseDto = new FilmResponseDto();
        filmResponseDto.setPrivateUrl(gameInfo.getPrivateUrl());

        return filmResponseDto;
    }

    public FilmResponseDto getCommonFilm(int gameRank, int gameSeq) {
        GameImage gameInfo = filmRepository.findByGameRankAndGameInfo(gameRank, gameSeq);
        FilmResponseDto filmResponseDto = new FilmResponseDto();
        filmResponseDto.setCommonUrl(gameInfo.getCommonUrl());

        return filmResponseDto;
    }

    public void savePrivateFilm(FilmDto filmInfo) throws IOException {
        GameImage gameImage = new GameImage();

        User user =  userRepository.findByUserSeq(filmInfo.getUserSeq());
        GameInfo gameInfo = gameRepository.findByGameSeq(filmInfo.getGameSeq());
        gameImage.setUser(user);
        gameImage.setGameRank(filmInfo.getPlayerRank());
        gameImage.setCreateDate(LocalDateTime.now());
        gameImage.setGameInfo(gameInfo);

        String privateFilmName = generateFileName(filmInfo.getPrivateFilm().getOriginalFilename());
        gameImage.setFileName(privateFilmName);
        String privateUrl = s3UploadService.saveFile(filmInfo.getPrivateFilm(), privateFilmName);

        gameImage.setPrivateUrl(privateUrl);
        filmRepository.save(gameImage);

    }

    public void saveCommonFilm(FilmDto filmInfo) throws Exception {
        GameImage gameImage = filmRepository.findByUserAndGameInfo(filmInfo.getUserSeq(), filmInfo.getGameSeq());

        String commonFilmName = "total_" + generateFileName(Objects.requireNonNull(filmInfo.getCommonFilm().getOriginalFilename()));
        gameImage.setTotalFileName(commonFilmName);

        String commonUrl = s3UploadService.saveFile(filmInfo.getCommonFilm(), commonFilmName);
        gameImage.setCommonUrl(commonUrl);
    }
}
