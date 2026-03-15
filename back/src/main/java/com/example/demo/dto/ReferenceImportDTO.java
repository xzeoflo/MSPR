package com.example.demo.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class ReferenceImportDTO {

    @CsvBindByName(column = "ID")
    private String ID;

    @CsvBindByName(column = "Gender")
    private String Gender;

    @CsvBindByName(column = "Weight")
    private Double Weight;

    @CsvBindByName(column = "Height")
    private Integer Height;

    @CsvBindByName(column = "BMI")
    private Double BMI;

    @CsvBindByName(column = "Condition")
    private String Condition;

    @CsvBindByName(column = "Severity")
    private String Severity;

    @CsvBindByName(column = "ActivityLevel")
    private String ActivityLevel;

    @CsvBindByName(column = "Calories")
    private Integer Calories;
}