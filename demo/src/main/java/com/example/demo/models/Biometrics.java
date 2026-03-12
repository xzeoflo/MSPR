package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "biometrics")
@Getter
@Setter
@NoArgsConstructor
public class Biometrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bio_id")
    private Integer id;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "measured_at")
    private LocalDate measuredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Biometrics(Double weightKg, Double heightCm, Integer heartRate, User user) {
        this.weightKg = weightKg;
        this.heightCm = heightCm;
        this.heartRate = heartRate;
        this.user = user;
        this.measuredAt = LocalDate.now();
    }
}