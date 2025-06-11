package com.example.HotelManager.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "video")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "videoId")
    private int videoId;
    @Column(name = "title")
    private String title; // multichoice, truefalse
    @Column(name = "driveUrl")
    private String driveUrl;
}