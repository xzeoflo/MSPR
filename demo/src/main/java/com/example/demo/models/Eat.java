package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "eat")
@Getter
@Setter
@NoArgsConstructor
public class Eat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meal_id")
    private Meal meal;

    @Column(name = "date_ate")
    private LocalDateTime dateAte;

    public Eat(User user, Meal meal, LocalDateTime dateAte) {
        this.user = user;
        this.meal = meal;
        this.dateAte = dateAte != null ? dateAte : LocalDateTime.now();
    }
}