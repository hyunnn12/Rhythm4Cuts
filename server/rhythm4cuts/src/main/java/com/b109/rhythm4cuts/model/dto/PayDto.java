package com.b109.rhythm4cuts.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class PayDto {
    private String email;
    private int payPoints;
}
