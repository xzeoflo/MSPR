package com.example.demo.models;

import java.util.ArrayList;
import java.util.List;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.models.enums.Intensity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer durationInSeconds = 0;
    private Integer repetitions = 0;
    private Integer sets = 0;
    private Integer caloriesBurned = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Intensity intensityLevel;

    private String exerciseType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataStatus status = DataStatus.PENDING;

    @Column(name = "origin_source")
    private String originSource = "EXTERNAL_API";

    @ElementCollection
    @CollectionTable(name = "exercise_equipments", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "equipment_name")
    private List<String> exerciseEquipments = new ArrayList<>();

    private Integer sequenceOrder;

    @ManyToMany(mappedBy = "exercises")
    @JsonIgnoreProperties("exercises")
    private List<Workout> workouts = new ArrayList<>();
}
