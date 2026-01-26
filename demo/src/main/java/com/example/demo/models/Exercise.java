package com.example.demo.models;

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
    private String intensityLevel;

    private Integer sequenceOrder;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;
}