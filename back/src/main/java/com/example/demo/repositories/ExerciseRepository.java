package com.example.demo.repositories;

import com.example.demo.models.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {

    Optional<Exercise> findByName(String name);

    // Utilisation de "Workouts" (pluriel) pour correspondre à la liste dans
    // l'entité
    List<Exercise> findByWorkouts_Id(Integer workoutId);

    // Utilisation de "Workouts" (pluriel) pour traverser la relation vers la marque
    List<Exercise> findByWorkouts_PartnerBrand(String partnerBrand);
}
