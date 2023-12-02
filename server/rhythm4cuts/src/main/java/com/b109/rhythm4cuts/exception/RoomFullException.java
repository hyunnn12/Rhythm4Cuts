package com.b109.rhythm4cuts.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RoomFullException extends RuntimeException {
    public RoomFullException(String message) {
        super(message);
    }
}