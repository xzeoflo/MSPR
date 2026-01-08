package com.example.demo.models;

import java.time.LocalDate;

public class Workout {

    private int workoutLogId;
    private LocalDate sessionDate;
    private int durationMinutes;
    private int actualCaloriesBurned;
    private int test;

    public Workout() {
    }

    public Workout(int workoutLogId, LocalDate sessionDate, int durationMinutes, int actualCaloriesBurned) {
        this.workoutLogId = workoutLogId;
        this.sessionDate = sessionDate;
        this.durationMinutes = durationMinutes;
        this.actualCaloriesBurned = actualCaloriesBurned;
    }

    public int getWorkoutLogId() {
        return workoutLogId;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public int getActualCaloriesBurned() {
        return actualCaloriesBurned;
    }
}
