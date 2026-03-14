package com.example.demo.repositories;

import com.example.demo.models.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    List<Exercise> findByWorkoutId(Integer workoutId);
    List<Exercise> findByWorkout_PartnerBrand(String partnerBrand);

}
