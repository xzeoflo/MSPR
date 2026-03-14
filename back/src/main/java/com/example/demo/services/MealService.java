package com.example.demo.services;

import com.example.demo.models.Eat;
import com.example.demo.models.Meal;
import com.example.demo.models.User;
import com.example.demo.repositories.EatRepository;
import com.example.demo.repositories.MealRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;
    private final EatRepository eatRepository;

    public MealService(MealRepository mealRepository, UserRepository userRepository, EatRepository eatRepository) {
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
        this.eatRepository = eatRepository;
    }

    public List<Meal> getAllMeals(String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand == null || requestingUserPartnerBrand.isEmpty()) {
            return mealRepository.findAll();
        }
        return mealRepository.findByPartnerBrand(requestingUserPartnerBrand);
    }

    public Meal getMealById(Integer id, String requestingUserPartnerBrand) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.equals(meal.getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return meal;
    }

    public Meal createMeal(Meal meal, String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand != null) {
            meal.setPartnerBrand(requestingUserPartnerBrand);
        }
        return mealRepository.save(meal);
    }

    public void associateUserToMeal(Integer mealId, Integer userId, LocalDateTime date,
            String requestingUserPartnerBrand) {
        Meal meal = getMealById(mealId, requestingUserPartnerBrand);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Eat eat = new Eat(user, meal, date);
        eatRepository.save(eat);
    }

    public Meal updateMeal(Integer id, Meal details, String requestingUserPartnerBrand) {
        Meal meal = getMealById(id, requestingUserPartnerBrand);

        if (details.getMealType() != null)
            meal.setMealType(details.getMealType());
        if (details.getQuantityG() != null)
            meal.setQuantityG(details.getQuantityG());
        if (details.getAllergies() != null)
            meal.setAllergies(details.getAllergies());
        if (details.getCaloriesKcal() != null)
            meal.setCaloriesKcal(details.getCaloriesKcal());
        if (details.getProteinG() != null)
            meal.setProteinG(details.getProteinG());
        if (details.getCarbsG() != null)
            meal.setCarbsG(details.getCarbsG());
        if (details.getFiberG() != null)
            meal.setFiberG(details.getFiberG());
        if (details.getFatsG() != null)
            meal.setFatsG(details.getFatsG());
        if (details.getSugarG() != null)
            meal.setSugarG(details.getSugarG());
        if (details.getSodiumMg() != null)
            meal.setSodiumMg(details.getSodiumMg());
        if (details.getCholesterolMg() != null)
            meal.setCholesterolMg(details.getCholesterolMg());

        if (requestingUserPartnerBrand == null && details.getPartnerBrand() != null) {
            meal.setPartnerBrand(details.getPartnerBrand());
        }

        return mealRepository.save(meal);
    }

    public void deleteMeal(Integer id, String requestingUserPartnerBrand) {
        Meal meal = getMealById(id, requestingUserPartnerBrand);
        mealRepository.delete(meal);
    }
}
