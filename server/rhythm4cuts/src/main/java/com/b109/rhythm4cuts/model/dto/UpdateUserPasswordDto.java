package com.b109.rhythm4cuts.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UpdateUserPasswordDto {
    String email;
    String newPassword;
    String oldPassword;
}
