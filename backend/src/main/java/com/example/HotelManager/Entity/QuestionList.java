package com.example.HotelManager.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "questionList")
public class QuestionList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "questionListId")
    private int id;
    @Column(name = "title")
    private String title; // multichoice, truefalse
    @Column(name = "description")
    private String description;
    @Column(name = "category")
    private String category;
    @Column(name = "questionCount")
    private String questionCount;
    @Column(name = "duration")
    private int duration;
    @Column(name = "difficulty")
    private String difficulty;
    @Column(name = "attempts")
    private int attempts = 3;
}