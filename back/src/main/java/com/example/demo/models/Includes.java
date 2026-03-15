package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "includes")
@Getter
@Setter
@NoArgsConstructor
public class Includes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @Column(name = "sequence_order")
    private Integer sequenceOrder;

    public Includes(Workout workout, Exercise exercise, Integer sequenceOrder) {
        this.workout = workout;
        this.exercise = exercise;
        this.sequenceOrder = sequenceOrder;
    }
}