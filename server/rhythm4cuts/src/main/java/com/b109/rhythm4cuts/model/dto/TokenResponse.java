package com.b109.rhythm4cuts.model.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {
    private String email;
    private String accessToken;
    private String refreshToken;
    //요청 시 토큰만 반환하는 것으로 변경
//    private String nickname;
//    private int points;
//    private int profile_img_seq;
//    private int user_seq;
}