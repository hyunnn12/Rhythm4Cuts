package com.b109.rhythm4cuts.model.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SongDto {
    private Integer songSeq;

    //제목
    private String title;

    //금영 TJ에서 노래 아이디
    private Integer songNo;

    //가수
    private String singer;

    //크롤링해서 가져올 음원 랭킹 순위
    private Integer songRank;

    //노래 플레이 횟수
    private Integer playCount;

    //영상 url
    private String url;

    //유튜브 영상 url의 id값
    private String youtubeId;

}
