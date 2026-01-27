package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.models.enums.UserRole;
import com.example.demo.repositories.UserRepository;
import com.example.demo.validators.UserValidator;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserValidator userValidator, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers(String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand == null || requestingUserPartnerBrand.isEmpty()) {
            return userRepository.findAll();
        }
        return userRepository.findAll().stream()
                .filter(user -> requestingUserPartnerBrand.equals(user.getPartnerBrand()))
                .collect(Collectors.toList());
    }

    public User getUserById(Integer id, String requestingUserPartnerBrand) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.equals(user.getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: User belongs to another partner");
        }

        return user;
    }

    public User getUserByEmail(String email, String requestingUserPartnerBrand) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.equals(user.getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: User belongs to another partner");
        }

        return user;
    }

    public User updateUser(Integer id, User userDetails, String requestingUserPartnerBrand) {
        User user = getUserById(id, requestingUserPartnerBrand);

        if (userDetails.getEmail() != null) {
            userValidator.validateEmail(userDetails.getEmail());
            user.setEmail(userDetails.getEmail());
        }

        if (userDetails.getFirstname() != null) user.setFirstname(userDetails.getFirstname());
        if (userDetails.getLastname() != null) user.setLastname(userDetails.getLastname());
        if (userDetails.getBirthday() != null) user.setBirthday(userDetails.getBirthday());
        if (userDetails.getSubscriptionTier() != null) user.setSubscriptionTier(userDetails.getSubscriptionTier());

        if (userDetails.getPartnerBrand() != null || (userDetails.getRole() != null && user.getRole() != userDetails.getRole())) {
            if (userDetails.getRole() != null) user.setRole(userDetails.getRole());
            if (userDetails.getPartnerBrand() != null) user.setPartnerBrand(userDetails.getPartnerBrand());
            userValidator.validatePartnerBrand(user);
        }

        return userRepository.save(user);
    }

    public void updatePassword(Integer id, String oldPassword, String newPassword, String requestingUserPartnerBrand) {
        User user = getUserById(id, requestingUserPartnerBrand);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ancien mot de passe incorrect");
        }

        userValidator.validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(Integer id, String requestingUserPartnerBrand) {
        User user = getUserById(id, requestingUserPartnerBrand);
        userRepository.delete(user);
    }
}