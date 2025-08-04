// dto/TripRecommendRequest.java
package com.ssdam.tripPaw.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class TripRecommendResponse {
	private int day; 
	private List<PlaceInfo> places;
	private LocalDate startDate;
	private LocalDate endDate;
	
	@Data
	@AllArgsConstructor
	public static class PlaceInfo {
	private Long placeId;
	private String name;
	private String description;
	private String latitude;
	private String longitude;
	private String imageUrl;
	}
}
