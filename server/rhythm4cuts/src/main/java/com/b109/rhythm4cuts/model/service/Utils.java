package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.UserDto;

import java.security.SecureRandom;
import java.util.Date;

public class Utils {
    public static UserDto dtoSetter(User user) {
        UserDto userDto = new UserDto();

        userDto.setUserSeq(user.getUserSeq());
        userDto.setName(user.getName());
        userDto.setNickname(user.getNickname());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.setPoint(user.getPoint());
//        userDto.setBirthDate(user.getBirthDate());
        userDto.setGender(user.getGender());
        userDto.setPlayCount(user.getPlayCount());
        userDto.setScoreSum(user.getScoreSum());
        userDto.setProfileImageSeq(user.getProfileImage().getProfileImageSeq());
        userDto.setIsOnline(user.getIsOnline());

        return userDto;
    }

    //임시 비밀번호 size 크기로 생성
    public static String getRandomString(int size) {
        char[] charSet = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
        StringBuffer sb = new StringBuffer();
        SecureRandom sr = new SecureRandom();
        sr.setSeed(new Date().getTime());

        int idx = 0;
        int len = charSet.length;

        for (int i = 0; i < size; i++) {
            idx = sr.nextInt(len);

            sb.append(charSet[idx]);
        }

        return sb.toString();
    }
}
