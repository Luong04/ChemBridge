package com.example.HotelManager.Entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "questionId")
    private int id;
    @Column(name = "questionListId")
    private int questionListId;
    @Column(name = "question")
    private String question;
    @Column(name = "answer")
    private int correctAnswer;
}