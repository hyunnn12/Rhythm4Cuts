package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class AddUserRequest {
    private String email;
    private String password;
    private String nickname;
    private String gender;
    private String name;
    private String profile_img_seq;
}
