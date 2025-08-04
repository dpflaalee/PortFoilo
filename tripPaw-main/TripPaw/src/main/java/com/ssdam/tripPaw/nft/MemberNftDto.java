package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberNftDto {
    private Long id;
    private String title;
    private Long tokenId;
    private String imageUrl;
    private Integer pointValue;
    private LocalDateTime usedAt;
    private String barcode;               
    private LocalDateTime issuedAt;       
    private LocalDateTime dueAt;      
    private String issuedReason;
    private LocalDateTime deletedAt; 
    
}