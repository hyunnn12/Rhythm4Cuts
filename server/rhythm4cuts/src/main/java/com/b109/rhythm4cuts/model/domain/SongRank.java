package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.SongRankDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter @Setter
@Entity
@Table(name = "SONG_RANK")
public class SongRank {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "song_rank_seq")
    private Long songRankSeq;

    // 노래 제목
    private String title;

    // 노래 가수
    private String singer;

    // 음원 랭킹 순위
    private int ranking;

    public SongRankDto getSongRankDto() {
        SongRankDto songRankDto = new SongRankDto();

        songRankDto.setSongRankSeq(this.getSongRankSeq());
        songRankDto.setTitle(this.getTitle());
        songRankDto.setSinger(this.getSinger());
        songRankDto.setRanking(this.getRanking());

        return songRankDto;
    }
}
