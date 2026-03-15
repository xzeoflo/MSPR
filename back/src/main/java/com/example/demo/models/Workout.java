package com.example.demo.models;

import com.example.demo.models.enums.WorkoutType;
import com.example.demo.models.enums.Intensity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workouts")
@Getter
@Setter
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Intensity difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkoutType workoutType;

    @Column(name = "partner_brand")
    private String partnerBrand;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    private List<Includes> includedExercises = new ArrayList<>();

    @Transient
    public Integer getTotalCaloriesBurned() {
        if (includedExercises == null || includedExercises.isEmpty()) {
            return 0;
        }
        return includedExercises.stream()
                .map(Includes::getExercise)
                .filter(ex -> ex != null && ex.getCaloriesBurned() != null)
                .mapToInt(Exercise::getCaloriesBurned)
                .sum();
    }

    @Transient
    public Integer getTotalDurationInMinutes() {
        if (includedExercises == null || includedExercises.isEmpty()) {
            return 0;
        }
        int totalSeconds = includedExercises.stream()
                .map(Includes::getExercise)
                .filter(ex -> ex != null && ex.getDurationInSeconds() != null)
                .mapToInt(Exercise::getDurationInSeconds)
                .sum();
        return totalSeconds / 60;
    }
}