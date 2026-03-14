package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private String getRequestingUserPartner(Principal principal) {
        if (principal instanceof Authentication authentication) {
            Object userPrincipal = authentication.getPrincipal();
            if (userPrincipal instanceof User user) {
                return user.getPartnerBrand();
            }
        }
        return null;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userService.getUserByEmail(principal.getName(), null);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<User>> getAllUsers(Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(userService.getAllUsers(brand));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<User> getUserById(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(userService.getUserById(id, brand));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(userService.getUserByEmail(email, brand));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(userService.updateUser(id, userDetails, brand));
    }

    @PatchMapping("/{id}/password")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> passwords,
            Principal principal) {

        String brand = getRequestingUserPartner(principal);
        userService.updatePassword(
                id,
                passwords.get("oldPassword"),
                passwords.get("newPassword"),
                brand);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        userService.deleteUser(id, brand);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.status(201).body(userService.createUser(user, brand));
    }

}
