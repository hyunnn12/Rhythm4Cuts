package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class PointLogDto {
    private Long logSeq;
    private int categorySeq;
    private int userSeq;
    private int pointHistory;
    private int remainPoint;
    private LocalDateTime createDate;

}
