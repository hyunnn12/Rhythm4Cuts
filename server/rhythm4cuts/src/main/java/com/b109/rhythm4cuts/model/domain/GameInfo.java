package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.LobbyDto;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "GAME_INFO")
public class GameInfo {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "game_seq")
    private int gameSeq;

    //게임방 제목
    private String title;

    //게임방에서 부른 노래 일련번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_seq")
    private Song song;

    //인원수 1로 초기화
    private Integer headCount;

    //암호 사용여부 false(0)이면 암호가 걸려있지 않고, true(1)이면 암호 걸려있다.
    @Column(name = "is_secret")
    private Boolean isSecret;

    //설정된 암호
    private String password;

    //대기중이면 wait, 게임 상태면 run, 게임 끝나면 end
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus roomStatus;

    //사진을 찍었으면 true, 안찍었으면 false
    @Column(name = "has_image")
    private Boolean hasImage;

    //게임에서 찍은 사진들
    @OneToMany(mappedBy = "gameInfo", cascade = CascadeType.ALL)
    private List<GameImage> gameImages = new ArrayList<>();

    //게임이 생성된 일시
    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    // OpenVidu 세션 아이디
    @Column(name = "session_id")
    private String sessionId;

    public GameInfo() {
        this.headCount = 0;
        this.isSecret = false;
        this.hasImage = false;
        this.roomStatus = RoomStatus.WAIT;
    }

    public LobbyDto getLobbyDto() {
        LobbyDto lobbyDto = new LobbyDto();

        lobbyDto.setGameSeq(this.getGameSeq());
        lobbyDto.setTitle(this.getTitle());
        lobbyDto.setSongSeq(this.getSong().getSongSeq());
        lobbyDto.setHeadcount(this.getHeadCount());
        lobbyDto.setIsSecret(this.getIsSecret() ? 1 : 0);
        lobbyDto.setPassword(this.getPassword());
//        lobbyDto.setStatus(this.getRoomStatus());
        lobbyDto.setSessionId(this.getSessionId());
        lobbyDto.setSongTitle(this.getSong().getTitle());
        lobbyDto.setYoutubeId(this.getSong().getYoutubeId());
        return lobbyDto;
    }

    @Override
    public String toString() {
        return "GameInfo{" +
                "gameSeq=" + gameSeq +
                ", title='" + title + '\'' +
                ", song=" + song +
                ", headCount=" + headCount +
                ", isSecret=" + isSecret +
                ", password='" + password + '\'' +
                ", roomStatus=" + roomStatus +
                ", hasImage=" + hasImage +
                ", gameImages=" + gameImages +
                ", createDate=" + createDate +
                ", sessionId='" + sessionId + '\'' +
                '}';
    }
}
