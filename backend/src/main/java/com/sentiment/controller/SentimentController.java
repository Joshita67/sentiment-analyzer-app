package com.sentiment.controller;

import com.sentiment.dto.SentimentRequest;
import com.sentiment.dto.SentimentResponse;
import com.sentiment.service.SentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SentimentController {

    private final SentimentService sentimentService;
    private final com.sentiment.repository.AnalysisHistoryRepository historyRepository;
    private final com.sentiment.repository.UserRepository userRepository;

    @Autowired
    public SentimentController(SentimentService sentimentService, 
                               com.sentiment.repository.AnalysisHistoryRepository historyRepository,
                               com.sentiment.repository.UserRepository userRepository) {
        this.sentimentService = sentimentService;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/analyze")
    public ResponseEntity<SentimentResponse> analyze(
            @RequestBody SentimentRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {
        
        if (request.getText() == null || request.getText().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        SentimentResponse response = sentimentService.analyzeText(request.getText());
        
        // Save to Database if Auth Token is passed
        if (token != null && !token.trim().isEmpty()) {
            Long userId = AuthController.tokenStore.get(token.replace("Bearer ", ""));
            if (userId != null) {
                com.sentiment.model.User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    com.sentiment.model.AnalysisHistory history = new com.sentiment.model.AnalysisHistory();
                    history.setUser(user);
                    history.setInputText(request.getText());
                    history.setSentimentLabel(response.getLabel());
                    history.setConfidenceScore(response.getScore());
                    historyRepository.save(history);
                }
            }
        }
        
        return ResponseEntity.ok(response);
    }
}
