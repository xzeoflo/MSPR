package com.example.demo.mappers;

import com.example.demo.dto.UserExportDTO;
import com.example.demo.dto.MealExportDTO;
import com.example.demo.models.User;
import com.example.demo.models.Meal;
import org.springframework.stereotype.Component;

@Component
public class DataMapper {

    public static UserExportDTO toDto(User user) {
        UserExportDTO dto = new UserExportDTO();
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBirthday(user.getBirthday());
        dto.setGender(user.getGender());
        dto.setActivityLevel(user.getActivityLevel());
        dto.setSubscriptionTier(user.getSubscriptionTier() != null ? user.getSubscriptionTier().name() : null);
        dto.setRole(user.getRole().name());
        return dto;
    }

    public static MealExportDTO toDto(Meal meal) {
        MealExportDTO dto = new MealExportDTO();
        dto.setMealType(meal.getMealType());
        dto.setQuantityG(meal.getQuantityG());
        dto.setAllergies(meal.getAllergies());
        dto.setCaloriesKcal(meal.getCaloriesKcal());
        dto.setProteinG(meal.getProteinG());
        dto.setCarbsG(meal.getCarbsG());
        dto.setFatsG(meal.getFatsG());
        dto.setPartnerBrand(meal.getPartnerBrand());
        return dto;
    }
}