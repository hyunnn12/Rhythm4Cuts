package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FriendDto {
    private Integer fromUser;
    private Integer toUser;
    private String message;
    private int gameSeq;
}
