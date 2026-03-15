package com.example.demo.repositories;

import com.example.demo.models.HealthProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthProfileRepository extends JpaRepository<HealthProfile, Integer> {

    Optional<HealthProfile> findByUserId(Integer userId);

    @Query("SELECT hp FROM HealthProfile hp JOIN hp.user u WHERE :brand IS NULL OR u.partnerBrand = :brand")
    List<HealthProfile> findAllByBrand(@Param("brand") String brand);
}
