package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_profiles")
@Getter
@Setter
@NoArgsConstructor
public class HealthProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer id;

    @Column(name = "disease_type")
    private String diseaseType;

    @Column(name = "disease_severity")
    private String diseaseSeverity;

    @Column(name = "blood_pressure_avg")
    private String bloodPressureAvg;

    @Column(name = "blood_glucose_mg")
    private Double bloodGlucoseMg;

    @Column(name = "cholesterol_mg_dl")
    private Double cholesterolMgDl;

    @Column(name = "dietary_restrictions")
    private String dietaryRestrictions;

    @Column(name = "allergies")
    private String allergies;

    @Column(name = "dietary_recommendation")
    private String dietaryRecommendation;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private User user;
}
