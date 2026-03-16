package com.example.demo.services;

import com.example.demo.models.Eat;
import com.example.demo.models.Meal;
import com.example.demo.models.User;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.dto.MealExportDTO;
import com.example.demo.mappers.DataMapper;
import com.example.demo.repositories.EatRepository;
import com.example.demo.repositories.MealRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.dto.external.ExternalMealDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

        if (requestingUserPartnerBrand == null) {
            return meal;
        }

        if (meal.getPartnerBrand() != null && !requestingUserPartnerBrand.equals(meal.getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return meal;
    }

    public Meal createMeal(Meal meal, String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand != null) {
            meal.setPartnerBrand(requestingUserPartnerBrand);
        } else {
            if (meal.getPartnerBrand() == null || meal.getPartnerBrand().isEmpty()) {
                meal.setPartnerBrand("Internal");
            }
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

        if (details.getName() != null && !details.getName().trim().isEmpty()) {
            meal.setName(details.getName());
        }

        if (details.getMealType() != null) {
            meal.setMealType(details.getMealType());
        }

        if (details.getQuantityG() != null)
            meal.setQuantityG(details.getQuantityG());
        if (details.getCaloriesKcal() != null)
            meal.setCaloriesKcal(details.getCaloriesKcal());
        if (details.getProteinG() != null)
            meal.setProteinG(details.getProteinG());
        if (details.getCarbsG() != null)
            meal.setCarbsG(details.getCarbsG());
        if (details.getFatsG() != null)
            meal.setFatsG(details.getFatsG());
        if (details.getFiberG() != null)
            meal.setFiberG(details.getFiberG());
        if (details.getSugarG() != null)
            meal.setSugarG(details.getSugarG());
        if (details.getAllergies() != null) {
            meal.setAllergies(details.getAllergies());
        }

        if (requestingUserPartnerBrand == null && details.getPartnerBrand() != null) {
            meal.setPartnerBrand(details.getPartnerBrand());
        }

        return mealRepository.save(meal);
    }

    public void deleteMeal(Integer id, String requestingUserPartnerBrand) {
        Meal meal = getMealById(id, requestingUserPartnerBrand);
        mealRepository.delete(meal);
    }

    public List<MealExportDTO> exportMeals(String brand, String role) {
        List<Meal> meals;
        if ("ADMIN".equals(role)) {
            meals = mealRepository.findAll();
        } else {
            meals = mealRepository.findByPartnerBrand(brand);
        }
        return meals.stream()
                .map(DataMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void importMealsFromCSV(org.springframework.web.multipart.MultipartFile file) throws Exception {
        try (java.io.BufferedReader reader = new java.io.BufferedReader(
                new java.io.InputStreamReader(file.getInputStream(), java.nio.charset.StandardCharsets.UTF_8))) {

            com.opencsv.bean.HeaderColumnNameMappingStrategy<ExternalMealDTO> strategy = new com.opencsv.bean.HeaderColumnNameMappingStrategy<>();
            strategy.setType(ExternalMealDTO.class);

            com.opencsv.bean.CsvToBean<ExternalMealDTO> csvToBean = new com.opencsv.bean.CsvToBeanBuilder<ExternalMealDTO>(
                    reader)
                    .withMappingStrategy(strategy)
                    .withType(ExternalMealDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withSeparator(',')
                    .withThrowExceptions(false)
                    .build();

            List<ExternalMealDTO> dtos = csvToBean.parse();

            csvToBean.getCapturedExceptions().forEach(ex -> {
                System.err.println("Ligne CSV ignorée : " + ex.getMessage());
            });

            for (ExternalMealDTO dto : dtos) {
                if (dto.getName() == null || dto.getName().trim().isEmpty())
                    continue;

                // Éviter les doublons
                if (mealRepository.existsByName(dto.getName()))
                    continue;

                Meal meal = new Meal();
                // MAPPING CORRECT
                meal.setName(dto.getName()); // ex: "Scrambled Eggs"
                meal.setMealType(dto.getMealType()); // ex: "Breakfast"

                // Valeurs nutritionnelles
                meal.setCaloriesKcal(dto.getCalories() != null ? dto.getCalories() : 0.0);
                meal.setProteinG(dto.getProteins() != null ? dto.getProteins() : 0.0);
                meal.setCarbsG(dto.getCarbohydrates() != null ? dto.getCarbohydrates() : 0.0);
                meal.setFatsG(dto.getLipids() != null ? dto.getLipids() : 0.0);
                meal.setFiberG(dto.getFiber() != null ? dto.getFiber() : 0.0);
                meal.setSugarG(dto.getSugar() != null ? dto.getSugar() : 0.0);

                // OPTIONNEL : Ajoute ces setters si tu as les colonnes dans ton entité Meal
                // meal.setSodiumMg(dto.getSodium());
                // meal.setCholesterolMg(dto.getCholesterol());

                meal.setQuantityG(100.0); // Portion par défaut
                meal.setPartnerBrand("Imported");
                meal.setStatus(DataStatus.PENDING);

                mealRepository.save(meal);
            }
        }
    }

    @Transactional
    public void validateMultipleMeals(List<Integer> ids) {
        for (Integer id : ids) {
            Meal meal = mealRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repas non trouvé : " + id));

            meal.setStatus(DataStatus.APPROVED);
            meal.setPartnerBrand("Imported");

            mealRepository.save(meal);
        }
    }
}
