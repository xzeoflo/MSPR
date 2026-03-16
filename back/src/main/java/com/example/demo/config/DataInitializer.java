package com.example.demo.config;

import com.example.demo.models.User;
import com.example.demo.models.enums.UserRole;
import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.default.email}")
    private String adminEmail;

    @Value("${admin.default.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setFirstName("System");
                admin.setLastName("Administrator");
                admin.setRole(UserRole.ADMIN);
                admin.setSubscriptionTier(SubscriptionTier.PREMIUM_PLUS);

                userRepository.save(admin);
                System.out.println("COMPTE ADMIN CRÉÉ avec l'email : " + adminEmail);
            } else {
                System.out.println("Compte admin déjà présent en base.");
            }
        };
    }
}
