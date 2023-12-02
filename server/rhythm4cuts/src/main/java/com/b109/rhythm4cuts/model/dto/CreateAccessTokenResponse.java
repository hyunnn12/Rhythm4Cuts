package com.b109.rhythm4cuts.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// member/login 응답 DTO
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class CreateAccessTokenResponse {
    private String accessToken;
    private String nickname;
    private int points;
    private int profile_img_seq;
}
