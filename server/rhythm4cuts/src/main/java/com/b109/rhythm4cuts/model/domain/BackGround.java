package com.b109.rhythm4cuts.model.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter @Setter
@Entity
@Table(name = "BACKGROUND")
public class BackGround {

    //4~6개의 기본 이미지를 제공한다. 사용자는 제공된 이미지에서 1개를 선택해 프로필 사진으로 선택한다.
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "background_seq")
    private Integer backgroundSeq;

    //사진 이름
    @Column(name = "background_name")
    private String background_name;


    //서버에 저장될 사진의 파일명(연 월 일 시 분 초 + 난수 8자리)
    @Column(name = "file_name")
    private String fileName;

    //이미지 설명
    private String description;
}
