package com.b109.rhythm4cuts.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserNicknameDto {
    String email;
    String nickname;
}
