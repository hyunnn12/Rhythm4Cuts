package com.b109.rhythm4cuts.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ProfileImageDto {
    String imageId;
    byte[] image;
}
