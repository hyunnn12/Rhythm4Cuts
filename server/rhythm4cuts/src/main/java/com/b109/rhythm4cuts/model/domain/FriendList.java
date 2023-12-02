package com.b109.rhythm4cuts.model.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "FRIEND_LIST")
public class FriendList {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "friend_list_seq")
    private Integer friendListSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user")
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user")
    private User toUser;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;
}

