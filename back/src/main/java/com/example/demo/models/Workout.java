package com.example.demo.models;

import com.example.demo.models.enums.WorkoutType;
import com.example.demo.models.enums.Intensity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "workout_exercises", joinColumns = @JoinColumn(name = "workout_id"), inverseJoinColumns = @JoinColumn(name = "exercise_id"))
    @JsonIgnoreProperties("workouts")
    private List<Exercise> exercises = new ArrayList<>();

    @Transient
    public Integer getTotalCaloriesBurned() {
        if (exercises == null || exercises.isEmpty()) {
            return 0;
        }
        return exercises.stream()
                .map(Exercise::getCaloriesBurned)
                .filter(cal -> cal != null)
                .reduce(0, Integer::sum);
    }

    @Transient
    public Integer getTotalDurationInSeconds() {
        if (exercises == null || exercises.isEmpty()) {
            return 0;
        }
        return exercises.stream()
                .map(Exercise::getDurationInSeconds)
                .filter(dur -> dur != null)
                .reduce(0, Integer::sum);
    }
}
