package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "USER")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_seq")
    private Integer userSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_image_seq")
    private ProfileImage profileImage;

    private String email;

    //유저 비밀번호 SHA 512
    private String password;

    private String name;

    private String nickname;

    //유저 생년월일
//    @Column(name = "birth_date")
//    private LocalDate birthDate;
    @Column(name = "gender")
    private String gender;

    // 게임을 하면서 유저가 모은 포인트이다.  찍은 사진을 다운로드할 때 사용한다. 게임 점수나 돈으로도 추가할 수 있다.
    private Integer point;

    //유저가 플레이한 게임 수
    @Column(name="play_count")
    private Integer playCount;

    //모든 게임에 대하 누적 점수
    @Column(name="score_sum")
    private Integer scoreSum;

    //유저가 탈퇴한 시간 null이면 탈퇴하지 않고 null이 아니면 탈퇴한 상태이다
    @Column(name = "resign_date")
    private LocalDateTime resignDate;

    //최재용
    @Column(name = "refresh_token")
    private String refreshToken;

    //유저가 생성된 시간
    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @OneToMany(mappedBy = "fromUser", cascade = CascadeType.ALL)
    private List<RequestFriend> requestFromFriends = new ArrayList<>();

    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL)
    private List<RequestFriend> requestToFriends = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PointLog> pointLogs = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<GameImage> gameImages = new ArrayList<>();

    // OpenVidu 커넥션 아이디
    @Column(name = "connection_id")
    private String connectionId;

    // 온라인 상태 여부 (0: 오프라인 / 1: 온라인)
    @Column(name = "is_online")
    private int isOnline;

    @Column(name="state")
    private int state;

    public User() {
        this.point = 0;
        this.playCount = 0;
        this.scoreSum = 0;
        this.state = 0;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("user"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public UserDto getUserDto() {
        UserDto userDto = new UserDto();
        userDto.setName(this.getName());
        userDto.setNickname(this.getNickname());
        userDto.setUserSeq(this.getUserSeq());
        userDto.setEmail(this.getEmail());
        userDto.setPoint(this.getPoint());
        userDto.setScoreSum(this.getScoreSum());
//        userDto.setBirthDate(this.birthDate);
        userDto.setGender(this.getGender());
        userDto.setConnectionId(this.getConnectionId());
        userDto.setProfileImageSeq(this.getProfileImage().getProfileImageSeq());
//        userDto.setBirthDate(this.getBirthDate());
        userDto.setGender(this.getGender());
        userDto.setState(this.getState());
        userDto.setIsOnline(this.getIsOnline());
        return userDto;
    }
}
