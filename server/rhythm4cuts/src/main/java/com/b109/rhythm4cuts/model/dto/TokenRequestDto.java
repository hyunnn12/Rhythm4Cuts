package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TokenRequestDto {
    private String email;
    private String accessToken;
    private String refreshToken;
}
