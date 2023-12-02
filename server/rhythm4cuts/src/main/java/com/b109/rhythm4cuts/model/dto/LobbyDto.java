package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class LobbyDto {

    private int gameSeq;
    private String title;
    private int songSeq;
    private String songTitle;
    private int headcount;
    private int isSecret;
    private String password;
    private String status;
    private int hasImage;
    private LocalDateTime createDate;
    private String sessionId;
    private String youtubeId;
}
