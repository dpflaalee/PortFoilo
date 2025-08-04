package com.ssdam.tripPaw.search;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.dto.PlaceSearchDto;
import com.ssdam.tripPaw.dto.SearchResultDto;
import com.ssdam.tripPaw.dto.TripPlanSearchDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SearchService {

    private final SearchMapper searchMapper;

    public SearchResultDto search(String keyword, String region, int offset, int tripPlanOffset) {
        System.out.println("...............[SearchService] : keyword=" + keyword + ", region=" + region + ", offset=" + offset + ", tripPlanOffset=" + tripPlanOffset);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("keyword", keyword);
        paramMap.put("region", region);
        paramMap.put("offset", offset); // 장소용
        paramMap.put("tripPlanOffset", tripPlanOffset); // 🆕 여행용

        //장소 검색
        List<Long> placeIds = searchMapper.findPlaceIdsByKeyword(paramMap);
        System.out.println(">>> Step 1 - placeIds: " + placeIds);
        List<Place> places = placeIds.isEmpty() ? List.of() : searchMapper.findPlacesByIds(placeIds);

        //여행 검색 (이제 tripPlanOffset 사용)
        //List<TripPlan> tripPlans = searchMapper.searchTripPlansByKeyword(paramMap);
        List<Long> tripPlanIds = searchMapper.findTripPlanIdsByKeyword(paramMap);
        List<TripPlan> tripPlans = tripPlanIds.isEmpty()
            ? List.of()
            : searchMapper.findTripPlansByIds(tripPlanIds);

        List<PlaceSearchDto> placeDtos = mapPlaceList(places);
        List<TripPlanSearchDto> tripPlanDtos = mapTripPlanList(tripPlans);

        System.out.println("placeDtos = " + placeDtos.size());
        System.out.println("tripPlanDtos = " + tripPlanDtos.size());

        return new SearchResultDto(placeDtos, tripPlanDtos);
    }

    //그대로 유지
    private List<PlaceSearchDto> mapPlaceList(List<Place> places) {
        return places.stream().map(p -> {
            PlaceSearchDto dto = new PlaceSearchDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setDescription(p.getDescription());
            dto.setLatitude(p.getLatitude());
            dto.setLongitude(p.getLongitude());
            dto.setRegion(p.getRegion());
            dto.setOpenHours(p.getOpenHours());
            dto.setPetFriendly(p.isPetFriendly());
            dto.setPetVerified(p.isPetVerified());
            dto.setRestDays(p.getRestDays());
            dto.setPrice(p.getPrice());
            dto.setParking(p.getParking());
            dto.setPhone(p.getPhone());
            dto.setImageUrl(p.getImageUrl());
            dto.setHomePage(p.getHomePage());
            dto.setExternalContentId(p.getExternalContentId());
            dto.setSource(p.getSource());

            dto.setPlaceType(p.getPlaceType());
            dto.setReviews(p.getReviews());
            dto.setPlaceImages(p.getPlaceImages());

            int reviewCount = (p.getReviews() != null) ? p.getReviews().size() : 0;
            dto.setReviewCount((long) reviewCount);

            double avgRating = 0.0;
            if (p.getReviews() != null && !p.getReviews().isEmpty()) {
                avgRating = p.getReviews().stream()
                        .mapToInt(r -> {
                            Integer rating = r.getRating();
                            return rating != null ? rating : 0;
                        })
                        .average().orElse(0.0);
            }
            dto.setAvgRating(avgRating);

            return dto;
        }).collect(Collectors.toList());
    }

    private List<TripPlanSearchDto> mapTripPlanList(List<TripPlan> tripPlans) {
        return tripPlans.stream().map(tp -> {
            TripPlanSearchDto dto = new TripPlanSearchDto();
            dto.setId(tp.getId());
            dto.setTitle(tp.getTitle());
            dto.setDays(tp.getDays());
            dto.setPublicVisible(tp.isPublicVisible());
            dto.setCreatedAt(tp.getCreatedAt());
            dto.setImageUrl(tp.getImageUrl());
            dto.setAuthorNickname(tp.getMember().getNickname());

            dto.setTripPlanCourses(tp.getTripPlanCourses());
            dto.setReviews(tp.getReviews());

            List<Review> reviews = tp.getReviews();
            if (reviews != null && !reviews.isEmpty()) {
                double avg = reviews.stream()
                        .mapToInt(Review::getRating)
                        .average().orElse(0.0);
                dto.setAvgRating(avg);
                dto.setReviewCount((long) reviews.size());
            } else {
                dto.setAvgRating(0.0);
                dto.setReviewCount(0L);
            }

            return dto;
        }).collect(Collectors.toList());
    }
}
