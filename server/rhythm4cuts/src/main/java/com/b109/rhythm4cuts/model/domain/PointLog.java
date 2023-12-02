package com.b109.rhythm4cuts.model.domain;

import com.b109.rhythm4cuts.model.dto.PointLogDto;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name="POINT_LOG")
public class PointLog {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="log_seq")
    private Long logSeq;

    //카테고리 코드
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code")
    private Category category;

    //포인트 사용한 유저 일련번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq")
    private User user;

    //포인트 증감 내역
    @Column(name="point_history")
    private Integer pointHistory;

    //증감 이후 포인트
    @Column(name="remain_point")
    private Integer remainPoint;

    //로그 생성된 시간
    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    public void setUser(User user) {
        this.user = user;
        user.getPointLogs().add(this);
    }

    public PointLogDto getPointLogDto() {
        PointLogDto pointLogDto = new PointLogDto();
        pointLogDto.setLogSeq(this.getLogSeq());
        pointLogDto.setCategorySeq(this.getCategory().getCode());
        pointLogDto.setUserSeq(this.getUser().getUserSeq());
        pointLogDto.setPointHistory(this.getPointHistory());
        pointLogDto.setRemainPoint(this.getRemainPoint());
        pointLogDto.setCreateDate(this.getCreateDate());

        return pointLogDto;
    }
}
