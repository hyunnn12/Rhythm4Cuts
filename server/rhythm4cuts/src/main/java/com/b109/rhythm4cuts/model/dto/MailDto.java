package com.b109.rhythm4cuts.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailDto {
    private String[] address;
    private String[] ccAddress;
    private String title;
    private String content;
}
