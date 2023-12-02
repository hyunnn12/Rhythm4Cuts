package com.b109.rhythm4cuts.model.domain;


import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "REQUEST_FRIEND")
public class RequestFriend {
    @Id @GeneratedValue
    @Column(name = "request_seq")
    private Long requestSeq;

    //요청 후 대기중이면 WAIT, 거절이면 REJECTED, 연결되면 CONNECTED
    @Enumerated(EnumType.STRING)
    @Column(name = "request_status")
    private RequestStatus requestStatus;

    //요청한 유저 일련번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user")
    private User fromUser;

    //요청받은 유저 일련번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user")
    private User toUser;

    //요청이 발생한 시간
    @CreationTimestamp
    @Column(name = "request_date")
    private LocalDateTime requestDate;

    public RequestFriend(){
        this.requestStatus = RequestStatus.WAIT;
    }

    public void setToFriend(User toUser) {
        this.toUser = toUser;
        toUser.getRequestToFriends().add(this);
    }

    public void setFromFriend(User fromUser) {
        this.fromUser = fromUser;
        fromUser.getRequestFromFriends().add(this);
    }
}
