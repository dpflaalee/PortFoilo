package com.ssdam.tripPaw.dto;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.PlaceImage;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.PlaceType;
import lombok.Data;

import java.util.List;

@Data
public class PlaceSearchDto {
    private Long id;
    private String name;
    private String description;
    private String latitude;
    private String longitude;
    private String region;
    private String openHours;
    private boolean petFriendly;
    private boolean petVerified;
    private String restDays;
    private String price;
    private String parking;
    private String phone;
    private String imageUrl;
    private String homePage;
    private Long externalContentId;
    private String source;

    private PlaceType placeType;
    private List<Review> reviews;

    private List<PlaceImage> placeImages;
    
    private Double avgRating;

    private long reviewCount;
}
