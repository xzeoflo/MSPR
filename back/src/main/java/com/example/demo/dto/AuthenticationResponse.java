package com.example.demo.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
}