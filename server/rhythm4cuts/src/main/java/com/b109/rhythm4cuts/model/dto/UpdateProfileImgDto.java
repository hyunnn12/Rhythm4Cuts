package com.b109.rhythm4cuts.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileImgDto {
    String email;
    Integer profileImageSeq;
    String imageName;
    String fileName;
    String description;

    @Override
    public String toString() {
        return "UpdateProfileImgDto{" +
                "email="+ email +
                "profileImageSeq=" + profileImageSeq +
                ", imageName='" + imageName + '\'' +
                ", fileName='" + fileName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}