package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) throws Exception {
        if (!isValidEmail(user.getEmail())) {
            throw new Exception("Email invalide");
        }
        if (user.getPassword().length() < 6) {
            throw new Exception("Mot de passe trop court (min 6 caractères)");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Cet email est déjà utilisé");
        }
        return userRepository.save(user);
    }

    public User login(String email, String password) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        throw new Exception("Identifiants incorrects");
    }

    private boolean isValidEmail(String email) {
        return email != null && email.contains("@") && email.contains(".");
    }
}