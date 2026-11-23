package com.fbdls.port1.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String initials;
    private int score;
    private String gameType = "jump"; // jump, dodge 등
    private LocalDateTime createdAt;

    public Leaderboard() {
        this.createdAt = LocalDateTime.now();
    }

    public Leaderboard(String initials, int score, String gameType) {
        this.initials = initials;
        this.score = score;
        this.gameType = gameType;
        this.createdAt = LocalDateTime.now();
    }
}
