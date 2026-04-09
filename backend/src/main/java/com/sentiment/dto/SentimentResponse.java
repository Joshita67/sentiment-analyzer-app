package com.sentiment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResponse {
    private String label; // POSITIVE, NEGATIVE, NEUTRAL
    private double score; // Confidence scale 0.0 to 1.0
}
