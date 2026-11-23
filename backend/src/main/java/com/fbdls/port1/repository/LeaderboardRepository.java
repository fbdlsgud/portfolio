package com.fbdls.port1.repository;

import com.fbdls.port1.entity.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {
    List<Leaderboard> findTop10ByOrderByScoreDesc();
    List<Leaderboard> findTop10ByGameTypeOrderByScoreDesc(String gameType);
}
