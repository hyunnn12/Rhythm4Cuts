package com.b109.rhythm4cuts.model.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="CATEGORY")
public class Category {

    //카테고리 코드
    @Id
    private Integer code;

    //포인트 소비 유형, 포인트 얻은 유형, 회원가입 시 지급, 프로필 사진 변경 시 소비 등등
    private String description;

}
