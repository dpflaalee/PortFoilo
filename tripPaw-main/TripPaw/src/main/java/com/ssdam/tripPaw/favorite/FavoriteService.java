package com.ssdam.tripPaw.favorite;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssdam.tripPaw.domain.Favorite;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.dto.FavoritePlaceDto;
import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanMapper;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.review.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;
    private final PlaceMapper placeMapper;
    private final ReviewMapper reviewMapper;
    private final MemberTripPlanMapper memberTripPlanMapper;

    // 즐겨찾기 등록
    public void addFavorite(Favorite favorite) {
        favoriteMapper.insertFavorite(favorite);
    }

    // 즐겨찾기 삭제
    public void removeFavorite(Favorite favorite) {
        favoriteMapper.deleteFavorite(favorite);
    }

    // 즐겨찾기 단건 조회
    @Transactional(readOnly = true)
    public Favorite getFavorite(Favorite favorite) {
        return favoriteMapper.selectFavorite(favorite);
    }

    // 특정 유저의 즐겨찾기 장소 목록 조회
    @Transactional(readOnly = true)
    public List<FavoritePlaceDto> getFavoritePlacesByMember(Long memberId) {
        List<Favorite> favorites = favoriteMapper.selectFavoritesByMemberId(memberId);

        // PLACE 타입만 필터링
        List<Long> placeIds = favorites.stream()
            .filter(f -> "PLACE".equals(f.getTargetType()))
            .map(Favorite::getTargetId)
            .collect(Collectors.toList());

        // 해당하는 장소 정보 가져오기
        List<Place> places = new ArrayList<>();
        for (Long placeId : placeIds) {
            Place place = placeMapper.findById(placeId);
            if (place != null) {
                places.add(place);
            }
        }

        // placeId → Place 매핑
        Map<Long, Place> placeMap = places.stream()
            .collect(Collectors.toMap(Place::getId, p -> p));

        // DTO 구성
        return favorites.stream()
            .filter(f -> "PLACE".equals(f.getTargetType()))
            .map(f -> {
                Place place = placeMap.get(f.getTargetId());
                if (place == null) return null;

                // 리뷰 정보 조회
                Double rating = reviewMapper.getAverageRatingByPlaceId(place.getId());
                Integer reviewCount = reviewMapper.getReviewCountByPlaceId(place.getId());

                return new FavoritePlaceDto(
                    f.getId(),
                    f.getMember().getId() != null ? f.getMember().getId() : 1L,
                    place.getId(),
                    place.getName(),
                    place.getImageUrl(),
                    place.getRegion(),
                    place.getPlaceType() != null ? place.getPlaceType().getName() : null,
                    rating != null ? rating : 0.0,
                    reviewCount != null ? reviewCount : 0
                );
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());
    }



}
