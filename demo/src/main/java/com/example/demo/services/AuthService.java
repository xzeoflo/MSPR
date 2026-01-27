package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.models.enums.UserRole;
import com.example.demo.repositories.UserRepository;
import com.example.demo.validators.UserValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, UserValidator userValidator, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerAdmin(User user) {
        user.setRole(UserRole.ADMIN);
        user.setPartnerBrand(null);
        return registerUser(user);
    }

    public User registerCoach(User user) {
        user.setRole(UserRole.COACH);
        return registerUser(user);
    }

    public User registerClient(User user) {
        user.setRole(UserRole.CLIENT);
        return registerUser(user);
    }

    private User registerUser(User user) {
        userValidator.validateUser(user);
        userValidator.validatePartnerBrand(user);

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        if (user.getSubscriptionTier() == null) {
            user.setSubscriptionTier(SubscriptionTier.FREEMIUM);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User loginAdmin(String email, String password) {
        User user = authenticate(email, password);
        userValidator.verifyAdminAccess(user);
        return user;
    }

    public User loginCoach(String email, String password) {
        User user = authenticate(email, password);
        userValidator.verifyCoachAccess(user);
        return user;
    }

    public User loginClient(String email, String password) {
        return authenticate(email, password);
    }

    private User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return user;
    }
}