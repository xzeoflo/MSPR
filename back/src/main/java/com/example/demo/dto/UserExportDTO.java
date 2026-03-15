package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserExportDTO {
    private String email;
    private String firstName;
    private String lastName;
    private LocalDate birthday;
    private String gender;
    private String activityLevel;
    private String subscriptionTier;
    private String role;
}
