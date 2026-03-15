package com.example.demo.models;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.models.enums.DataStatus;
import com.example.demo.models.enums.Intensity;
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

    @Enumerated(EnumType.STRING)
    private DataStatus status = DataStatus.APPROVED;

    @ElementCollection
    @CollectionTable(name = "exercise_equipments", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "equipment_name")
    private List<String> exerciseEquipments;

    @OneToMany(mappedBy = "exercise")
    private List<Includes> workoutsIncludingThis = new ArrayList<>();
}