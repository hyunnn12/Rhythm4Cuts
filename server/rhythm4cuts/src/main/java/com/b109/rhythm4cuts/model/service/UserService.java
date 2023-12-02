package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.*;
import org.hibernate.sql.Update;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    // Find a user by their ID
    UserDto findById(int userId);
    // Find a user by their nickname
    UserDto findByNickname(String nickname);
    boolean duplicateNickname(String nickname);
    // Find a user DTO (Data Transfer Object) by their email
    UserDto findByEmail(String email);
    int getPoint(String email);
    // Save a new user with the provided information
    String save(AddUserRequest dto);
    Integer getProfileImg(String email);
    void patchProfileImg(UpdateProfileImgDto dto);
    void updateNickname(UpdateUserNicknameDto dto);
    void updatePassword(UpdateUserPasswordDto dto);
    //상태 변환만 할 예정
    void logout(LogoutDto logoutDto);
    UserDto login(LoginDto loginDto);
    long payPoints(PayDto payDto);
    void findPassword(String email);
    MailDto createMailAndChangePassword(String email);
    MailDto createMailAndCertificate(String email);
    void sendEmail(MailDto mailDto);
    boolean checkCertificate(CertificateDto certificateDto);
    TokenResponse generateToken(UserDto userDto);
    TokenResponse reissueAuthenticationToken(TokenRequestDto tokenRequestDto);
    List<ProfileImageDto> getProfileImage(List<String> imageIds);
    String findNicknameById(int userSeq);
    List<PointLogDto> getPointLogs(int userSeq);
}
