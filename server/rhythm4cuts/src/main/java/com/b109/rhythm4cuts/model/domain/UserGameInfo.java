package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.UserGameInfoDto;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;

@Getter
@Setter
@Entity
@Table(name = "USER_GAMEINFO")
public class UserGameInfo implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_gameinfo_seq")
    private Integer userGameInfoSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_seq")
    private GameInfo gameInfo;

    @Column(name = "game_rank")
    private Integer gameRank;

    @Column(name = "game_order")
    private Integer gameOrder;

    @Column(name = "is_host")
    private Boolean isHost;

    @Column(name = "has_image")
    private Boolean hasImage;

    @Column(name = "game_score")
    private Integer gameScore;

    public UserGameInfo () {
        this.isHost = false;
        this.hasImage = false;
        this.gameScore = 0;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }

    public UserGameInfoDto getUserGameInfoDto() {
        UserGameInfoDto userGameInfoDto = new UserGameInfoDto();

        userGameInfoDto.setUserGameInfoSeq(this.getUserGameInfoSeq());
        userGameInfoDto.setGameSeq(this.getGameInfo().getGameSeq());
        userGameInfoDto.setUserSeq(this.getUser().getUserSeq());

        return userGameInfoDto;
    }
}
