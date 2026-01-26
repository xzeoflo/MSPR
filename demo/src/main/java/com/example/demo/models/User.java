package com.example.demo.models;

import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.models.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstname;
    private String lastname;
    private LocalDate birthday;

    @Column(name = "partner_brand")
    private String partnerBrand;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_tier")
    private SubscriptionTier subscriptionTier;

    @ManyToMany
    @JoinTable(
            name = "user_workouts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "workout_id")
    )
    private List<Workout> completedWorkouts = new ArrayList<>();

    public User(String email, String password, String firstname, UserRole role) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.role = role;
        this.subscriptionTier = SubscriptionTier.FREEMIUM;
    }
}