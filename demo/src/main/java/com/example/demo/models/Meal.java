import jakarta.persistence.*;

public class Meal {

    private int food_id;
    private String food_name;
    private String category;
    private int calories_kcal;
    private double protein_g;
    private double carbs_g;
    private double fats_g;

    public Meal() {
    }

    public Meal(int food_id, String food_name, String category, int calories_kcal, double protein_g, double carbs_g, double fats_g) {
        this.food_id = food_id;
        this.food_name = food_name;
        this.category = category;
        this.calories_kcal = calories_kcal;
        this.protein_g = protein_g;
        this.carbs_g = carbs_g;
        this.fats_g = fats_g;
    }


    public int getFoodId() { return food_id; }

    public String getFoodName() { return food_name; }

    public String getCategory() { return category; }

    public int getCaloriesKcal() { return calories_kcal; }

    public double getProteinG() { return protein_g; }

    public double getCarbsG() { return carbs_g; }

    public double getFatsG() { return fats_g; }
}