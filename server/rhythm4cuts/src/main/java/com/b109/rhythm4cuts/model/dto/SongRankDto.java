package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SongRankDto {

    private Long songRankSeq;
    private String title;
    private String singer;
    private int ranking;
}
