package com.b109.rhythm4cuts.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class LogoutDto {
    String email;
    String accessToken;
}