package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> registerAdmin(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerAdmin(user));
    }

    @PostMapping("/register/coach")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> registerCoach(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerCoach(user));
    }

    @PostMapping("/register/client")
    public ResponseEntity<User> registerClient(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerClient(user));
    }

    @PostMapping("/login/admin")
    public ResponseEntity<User> loginAdmin(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.ok(authService.loginAdmin(credentials.get("email"), credentials.get("password")));
    }

    @PostMapping("/login/coach")
    public ResponseEntity<User> loginCoach(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.ok(authService.loginCoach(credentials.get("email"), credentials.get("password")));
    }

    @PostMapping("/login/client")
    public ResponseEntity<User> loginClient(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.ok(authService.loginClient(credentials.get("email"), credentials.get("password")));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, null, null);
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}