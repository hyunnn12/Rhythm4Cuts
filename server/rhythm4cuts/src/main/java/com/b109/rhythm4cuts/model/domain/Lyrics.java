package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.LyricsDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter @Setter
@Entity
@Table(name = "LYRICS")
public class Lyrics {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "lyrics_seq")
    private Integer lyricsSeq;

    @Column(name = "start_time")
    private Integer startTime;

    @Column(name = "end_time")
    private Integer endTime;

    @Column(name = "song_order")
    private Integer songOrder;

    private String lyric;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_seq")
    private Song song;

    public void setSong(Song song) {
        this.song = song;
        song.getLyrics().add(this);
    }

    public LyricsDto getLyricsDto() {
        LyricsDto lyricsDto = new LyricsDto();

        lyricsDto.setLyricsSeq(this.getLyricsSeq());
        lyricsDto.setStartTime(this.getStartTime());
        lyricsDto.setEndTime(this.getEndTime());
        lyricsDto.setLyric(this.getLyric());
        lyricsDto.setSongOrder(this.getSongOrder());
        lyricsDto.setSongSeq(this.getSong().getSongSeq());

        return lyricsDto;
    }
}
