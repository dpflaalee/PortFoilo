package com.ssdam.tripPaw.category;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Category;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.place.PlaceMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceCategoryService {
	
	private final PlaceMapper placeMapper;
    private final PlaceCategoryMappingMapper placeCategoryMappingMapper;

    private static final Map<Long, List<Long>> placeTypeCategoryMap = Map.of(
            1L, List.of(1L, 2L, 3L, 34L, 73L, 74L, 75L),        // 관광지
            2L, List.of(31L, 32L, 33L, 35L),                    // 문화시설
            3L, List.of(2L, 7L, 24L, 25L, 27L, 36L, 44L, 45L),  // 숙박
            4L, List.of(30L, 64L, 65L),                         // 레포츠
            5L, List.of(38L, 39L, 40L, 41L),                    // 쇼핑
            6L, List.of(63L, 40L, 51L)                          // 음식점
        );
    
    public void insertPlaceAndMapCategories(Place place) {

        // 2. placeType에 따라 연결할 categoryId 목록을 코드에서 가져옴
        List<Long> categoryIds = placeTypeCategoryMap.getOrDefault(place.getPlaceType().getId(), List.of());

        // 3. 매핑 insert
        for (Long categoryId : categoryIds) {
            placeCategoryMappingMapper.insertMapping(place.getId(), categoryId);
        }
    }
}