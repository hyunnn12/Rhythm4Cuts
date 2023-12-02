package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.SongDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "SONG")
public class Song {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "song_seq")
    private int songSeq;

    //제목
    private String title;

    //금영 TJ에서 노래 아이디
    @Column(name = "song_no")
    private Integer songNo;

    //가수
    private String singer;

    //노래 플레이 횟수
    @Column(name = "play_count")
    private Integer playCount;

    //영상 url
    @Column(length = 500)
    private String url;

    //유튜브 영상의 url id값
    @Column(name = "youtube_id")
    private String youtubeId;

    //노래의 주파수 정보
    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL)
    private List<Pitch> pitches = new ArrayList<>();

    //노래 가사 정보
    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL)
    private List<Lyrics> lyrics = new ArrayList<>();

    public Song() {
        this.playCount = 0;
    }

    public SongDto getSongDto() {
        SongDto songDto = new SongDto();
        songDto.setSongSeq(this.getSongSeq());
        songDto.setTitle(this.getTitle());
        songDto.setUrl(this.getUrl());
        songDto.setYoutubeId(this.getYoutubeId());
        songDto.setSinger(this.getSinger());
        songDto.setPlayCount(this.getPlayCount());
        return songDto;
    }
}
