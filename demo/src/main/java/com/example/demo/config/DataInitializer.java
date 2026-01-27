package com.example.demo.config;

import com.example.demo.models.User;
import com.example.demo.models.enums.UserRole;
import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@healthai.fr";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@flo123"));
                admin.setFirstname("System");
                admin.setLastname("Administrator");
                admin.setRole(UserRole.ADMIN);
                admin.setSubscriptionTier(SubscriptionTier.PREMIUM_PLUS);

                userRepository.save(admin);
                System.out.println("✅ COMPTE ADMIN CRÉÉ : admin@healthai.fr / Admin@flo123");
            } else {
                System.out.println("ℹ️ Compte admin déjà présent en base.");
            }
        };
    }
}