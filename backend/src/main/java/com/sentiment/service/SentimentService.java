package com.sentiment.service;

import com.sentiment.dto.SentimentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class SentimentService {

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public SentimentService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public SentimentResponse analyzeText(String text) {
        if (apiKey.equals("YOUR_HF_API_KEY_HERE") || apiKey.isEmpty()) {
            return mockAnalysis(text);
        }

        try {
            // Hugging Face inference API returns a List of Lists of Maps
            // e.g., [[{"label": "POSITIVE", "score": 0.99}, {"label": "NEGATIVE", "score": 0.01}]]
            var response = webClient.post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("inputs", text))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<List<Map<String, Object>>>>() {})
                    .block();

            if (response != null && !response.isEmpty() && !response.get(0).isEmpty()) {
                // Find highest scoring sentiment
                Map<String, Object> bestResult = response.get(0).get(0);
                for (Map<String, Object> res : response.get(0)) {
                    if ((Double) res.get("score") > (Double) bestResult.get("score")) {
                        bestResult = res;
                    }
                }
                
                String label = (String) bestResult.get("label");
                double score = (Double) bestResult.get("score");
                
                return new SentimentResponse(label, score);
            }
        } catch (Exception e) {
            System.err.println("Error communicating with HF API: " + e.getMessage());
        }

        // Fallback or error
        return mockAnalysis(text);
    }

    private SentimentResponse mockAnalysis(String text) {
        // Simple mock for beginner experience without API key setup
        String lowerText = text.toLowerCase();
        double score = 0.85 + (Math.random() * 0.1); // Fake confidence between 85% and 95%
        
        if (lowerText.contains("happy") || lowerText.contains("good") || lowerText.contains("great") || lowerText.contains("love")) {
            return new SentimentResponse("POSITIVE", score);
        }
        if (lowerText.contains("bad") || lowerText.contains("sad") || lowerText.contains("hate") || lowerText.contains("terrible")) {
            return new SentimentResponse("NEGATIVE", score);
        }
        return new SentimentResponse("NEUTRAL", 0.65);
    }
}
