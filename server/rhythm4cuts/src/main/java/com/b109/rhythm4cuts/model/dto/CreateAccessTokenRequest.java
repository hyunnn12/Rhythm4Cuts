package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

// 요청 시 파라미터와 매핑될 DTO
@Getter
@Setter
public class CreateAccessTokenRequest {
    //토큰을 만드려는 사용자 닉네임
    private String nickname;
    private String refreshToken;
}
