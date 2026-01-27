package com.example.demo.models;

import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.models.enums.UserRole;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
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

    public User() {
    }

    public User(String email, String password, String firstname, UserRole role) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.role = role;
        this.subscriptionTier = SubscriptionTier.FREEMIUM;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public String getPartnerBrand() { return partnerBrand; }
    public void setPartnerBrand(String partnerBrand) { this.partnerBrand = partnerBrand; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public SubscriptionTier getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(SubscriptionTier subscriptionTier) { this.subscriptionTier = subscriptionTier; }
}