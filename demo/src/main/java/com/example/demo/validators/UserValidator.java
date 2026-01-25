package com.example.demo.validators;

import com.example.demo.models.User;
import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.models.enums.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Component
public class UserValidator {

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*]).{8,}$";

    public void validateUser(User user) {
        validateEmail(user.getEmail());
        validatePassword(user.getPassword());
        validatePartnerBrand(user);
    }

    public void validateEmail(String email) {
        if (email == null || !Pattern.matches(EMAIL_REGEX, email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format");
        }
    }

    public void validatePassword(String password) {
        if (password == null || !Pattern.matches(PASSWORD_REGEX, password)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password does not meet complexity requirements");
        }
    }

    public void validatePartnerBrand(User user) {
        if (user.getPartnerBrand() != null && user.getPartnerBrand().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Partner brand cannot be empty");
        }
    }

    public void verifyAdminAccess(User user) {
        if (user.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access restricted to Admins only");
        }
    }

    public void verifyCoachAccess(User user) {
        if (user.getRole() != UserRole.COACH) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access restricted to Coaches only");
        }
    }

    public void verifySubscriptionAccess(User user, SubscriptionTier requiredTier) {
        if (user.getSubscriptionTier() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User has no subscription");
        }

        if (user.getSubscriptionTier().ordinal() < requiredTier.ordinal()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient subscription tier");
        }
    }
}