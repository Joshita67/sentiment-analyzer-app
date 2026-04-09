package com.sentiment.repository;

import com.sentiment.model.AnalysisHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnalysisHistoryRepository extends JpaRepository<AnalysisHistory, Long> {
    List<AnalysisHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
