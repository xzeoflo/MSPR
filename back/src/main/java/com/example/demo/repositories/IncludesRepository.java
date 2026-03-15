package com.example.demo.repositories;

import com.example.demo.models.Includes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncludesRepository extends JpaRepository<Includes, Integer> {
}