package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WaitGameResponseDto {
    private int userSeq;
    private int order;
    private int score;
    private int profile_img_seq;
    private String nickname;

}
