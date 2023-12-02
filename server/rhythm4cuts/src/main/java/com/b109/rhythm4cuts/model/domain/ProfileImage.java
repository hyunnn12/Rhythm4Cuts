package com.b109.rhythm4cuts.model.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name="PROFILE_IMAGE")
public class ProfileImage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "profile_image_seq")
    private Integer profileImageSeq;

    //프로필 사진 이름
    @Column(name="image_name")
    private String imageName;

    //서버에 저장될 사진의 파일명 (연월일시분초_난수8자리)
    @Column(name="file_name")
    private String fileName;

    //이미지 사진에 대한 설명
    private String description;
}
