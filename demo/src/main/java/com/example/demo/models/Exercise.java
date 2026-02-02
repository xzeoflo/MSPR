package com.example.demo.models;

import com.example.demo.models.enums.Intensity;
import com.example.demo.models.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "exercises")
@Getter
@Setter
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;
    private Integer durationInSeconds;
    private Integer repetitions;
    private Integer sets;
    private Integer caloriesBurned;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Intensity intensityLevel;

    private String exerciseType;

    private Integer sequenceOrder;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;
}