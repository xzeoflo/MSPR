package com.example.demo.repositories;

import com.example.demo.models.Biometrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BiometricsRepository extends JpaRepository<Biometrics, Integer> {
    List<Biometrics> findByUserId(Integer userId);
}