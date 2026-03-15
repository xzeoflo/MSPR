package com.example.demo.repositories;

import com.example.demo.models.Exercise;
import com.example.demo.models.enums.DataStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {

    Optional<Exercise> findByName(String name);
    boolean existsByName(String name);

    @Query("SELECT e FROM Exercise e JOIN Includes i ON i.exercise.id = e.id JOIN Workout w ON i.workout.id = w.id WHERE w.partnerBrand = :brand")
    List<Exercise> findByWorkouts_Id(Integer workoutId);

    @Query("SELECT e FROM Exercise e JOIN Includes i ON i.exercise.id = e.id JOIN Workout w ON i.workout.id = w.id WHERE w.partnerBrand = :brand")
    List<Exercise> findByWorkouts_PartnerBrand(String partnerBrand);

    List<Exercise> findByStatus(DataStatus status);
}
