package com.example.demo.services;

import com.example.demo.models.Eat;
import com.example.demo.models.Meal;
import com.example.demo.models.User;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.repositories.EatRepository;
import com.example.demo.repositories.MealRepository;
import com.example.demo.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MealServiceTest {

    @Mock
    private MealRepository mealRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EatRepository eatRepository;

    @InjectMocks
    private MealService mealService;

    @Test
    void getAllMeals_WithNoBrand_ShouldReturnAll() {
        when(mealRepository.findAll()).thenReturn(Arrays.asList(new Meal(), new Meal()));
        List<Meal> result = mealService.getAllMeals(null);
        assertEquals(2, result.size());
        verify(mealRepository, times(1)).findAll();
    }

    @Test
    void getAllMeals_WithBrand_ShouldFilter() {
        when(mealRepository.findByPartnerBrand("Nike")).thenReturn(Arrays.asList(new Meal()));
        List<Meal> result = mealService.getAllMeals("Nike");
        assertEquals(1, result.size());
        verify(mealRepository, times(1)).findByPartnerBrand("Nike");
    }

    @Test
    void getMealById_Success() {
        Meal meal = new Meal();
        meal.setPartnerBrand("Nike");
        when(mealRepository.findById(1)).thenReturn(Optional.of(meal));
        Meal result = mealService.getMealById(1, "Nike");
        assertNotNull(result);
    }

    @Test
    void getMealById_Forbidden() {
        Meal meal = new Meal();
        meal.setPartnerBrand("Adidas");
        when(mealRepository.findById(1)).thenReturn(Optional.of(meal));
        assertThrows(ResponseStatusException.class, () -> mealService.getMealById(1, "Nike"));
    }

    @Test
    void createMeal_WithBrand() {
        Meal meal = new Meal();
        when(mealRepository.save(any(Meal.class))).thenAnswer(i -> i.getArguments()[0]);
        Meal saved = mealService.createMeal(meal, "Nike");
        assertEquals("Nike", saved.getPartnerBrand());
    }

    @Test
    void createMeal_InternalDefault() {
        Meal meal = new Meal();
        when(mealRepository.save(any(Meal.class))).thenAnswer(i -> i.getArguments()[0]);
        Meal saved = mealService.createMeal(meal, null);
        assertEquals("Internal", saved.getPartnerBrand());
    }

    @Test
    void associateUserToMeal_Success() {
        Meal meal = new Meal();
        User user = new User();
        when(mealRepository.findById(1)).thenReturn(Optional.of(meal));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        mealService.associateUserToMeal(1, 1, LocalDateTime.now(), null);

        verify(eatRepository, times(1)).save(any(Eat.class));
    }

    @Test
    void updateMeal_PartialUpdate() {
        Meal meal = new Meal();
        meal.setName("Old Name");
        when(mealRepository.findById(1)).thenReturn(Optional.of(meal));
        when(mealRepository.save(any(Meal.class))).thenAnswer(i -> i.getArguments()[0]);

        Meal details = new Meal();
        details.setName("New Name");
        Meal updated = mealService.updateMeal(1, details, null);

        assertEquals("New Name", updated.getName());
    }

    @Test
    void deleteMeal_Success() {
        Meal meal = new Meal();
        when(mealRepository.findById(1)).thenReturn(Optional.of(meal));
        mealService.deleteMeal(1, null);
        verify(mealRepository, times(1)).delete(meal);
    }

    @Test
    void validateMultipleMeals_Success() {
        Meal meal = new Meal();
        when(mealRepository.findById(anyInt())).thenReturn(Optional.of(meal));

        mealService.validateMultipleMeals(Arrays.asList(1, 2));

        assertEquals(DataStatus.APPROVED, meal.getStatus());
        assertEquals("Imported", meal.getPartnerBrand());
        verify(mealRepository, times(2)).save(any(Meal.class));
    }
}