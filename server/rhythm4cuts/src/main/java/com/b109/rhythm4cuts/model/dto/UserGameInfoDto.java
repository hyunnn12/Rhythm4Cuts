package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserGameInfoDto {

    private int userGameInfoSeq;
    private int userSeq;
    private int gameSeq;
    private int gameRank;
    private int gameOrder;
    private int isHost;
    private int hasImage;
    private int gameScore;
}
