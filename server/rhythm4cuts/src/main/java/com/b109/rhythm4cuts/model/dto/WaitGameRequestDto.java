package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WaitGameRequestDto {
    private int gameSeq;
    private List<Integer> playerSeq;
}