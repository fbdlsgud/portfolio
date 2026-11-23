package com.fbdls.port1.controller;

import com.fbdls.port1.entity.Leaderboard;
import com.fbdls.port1.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/leaderboard")
    public List<Leaderboard> getTop10(@RequestParam(defaultValue = "jump") String gameType) {
        return leaderboardService.getTop10(gameType);
    }

    @PostMapping("/leaderboard")
    public ResponseEntity<Leaderboard> registerScore(@RequestBody Leaderboard leaderboard) {
        Leaderboard saved = leaderboardService.saveScore(leaderboard);
        return ResponseEntity.ok(saved);
    }
}
