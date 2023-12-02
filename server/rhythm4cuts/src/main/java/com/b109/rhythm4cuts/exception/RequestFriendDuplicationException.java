package com.b109.rhythm4cuts.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RequestFriendDuplicationException extends RuntimeException {
    public RequestFriendDuplicationException(String message) {
        super(message);
    }
}
