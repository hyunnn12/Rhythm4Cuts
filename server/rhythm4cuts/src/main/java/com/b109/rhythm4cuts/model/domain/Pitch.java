package com.b109.rhythm4cuts.model.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter @Setter
@Entity
@Table(name = "PITCH")
public class Pitch {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "pitch_seq")
    private Integer pitchSeq;

    private Integer time;

    private Integer frequency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_seq")
    private Song song;

    public void setSong(Song song) {
        this.song = song;
        song.getPitches().add(this);
    }
}
