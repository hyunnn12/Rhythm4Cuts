package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VoiceLogDto {

    private int voiceLogSeq;
    private int gameLogSeq;
    private String voiceFile;
    private String voiceUrl;
}
