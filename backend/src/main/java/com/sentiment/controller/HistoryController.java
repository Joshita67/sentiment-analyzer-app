package com.sentiment.controller;

import com.sentiment.model.AnalysisHistory;
import com.sentiment.repository.AnalysisHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final AnalysisHistoryRepository historyRepository;

    @Autowired
    public HistoryController(AnalysisHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping
    public ResponseEntity<List<AnalysisHistory>> getHistory(@RequestHeader(value="Authorization", required=false) String token) {
        if (token == null) return ResponseEntity.status(401).build();
        
        Long userId = AuthController.tokenStore.get(token.replace("Bearer ", ""));
        if (userId == null) return ResponseEntity.status(401).build();

        List<AnalysisHistory> history = historyRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(history);
    }
}
