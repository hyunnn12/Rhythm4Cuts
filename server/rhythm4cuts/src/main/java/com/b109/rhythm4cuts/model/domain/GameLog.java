package com.b109.rhythm4cuts.model.domain;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "GAME_LOG")
public class GameLog {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "game_log_seq")
    private Long GameLogSeq;

    //로그를 생성한 유저 일련번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq")
    private User user;

    //로그를 생성한 게임 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_seq")
    private GameInfo gameInfo;

    //로그 생성일시
    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    //음성 로그
    @OneToMany(mappedBy = "gameLog", cascade = CascadeType.ALL)
    private List<VoiceLog> voiceLogs = new ArrayList<>();

}
