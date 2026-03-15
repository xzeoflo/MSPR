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

    List<Exercise> findByWorkouts_Id(Integer workoutId);

    List<Exercise> findByWorkouts_PartnerBrand(String partnerBrand);

    List<Exercise> findByStatus(DataStatus status);
}
