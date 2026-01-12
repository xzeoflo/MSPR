package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class MsprApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsprApplication.class, args);
    }

    @Bean
    public CommandLineRunner checkConnection(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                System.out.println("CONNEXION BDD RÉUSSIE : " + connection.getMetaData().getURL());
            } catch (Exception e) {
                System.out.println("ÉCHEC CONNEXION BDD : " + e.getMessage());
            }
        };
    }
}