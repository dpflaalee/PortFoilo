package com.ssdam.tripPaw.dto;

import com.ssdam.tripPaw.domain.Place;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoritePlaceDto {
    private Long favoriteId;
    private Long memberId;
    private Long placeId;
    private String placeName;
    private String imageUrl;
    private String region;
    private String placeTypeName;
    private Double rating;
    private Integer reviewCount;
}
