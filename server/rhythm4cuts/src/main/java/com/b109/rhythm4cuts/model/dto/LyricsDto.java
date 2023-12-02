package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LyricsDto {

    private int lyricsSeq;
    private int startTime;
    private int endTime;
    private int songOrder;
    private String lyric;
    private int songSeq;
}
