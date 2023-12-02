package com.b109.rhythm4cuts.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Setter
@Getter
public class FilmResponseDto {
    private LocalDateTime createDate;
    private String commonUrl;
    private String privateUrl;
}
