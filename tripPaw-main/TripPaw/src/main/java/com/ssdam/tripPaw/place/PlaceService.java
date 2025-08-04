package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.dto.PlaceSearchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceMapper placeMapper;

    public PlaceSearchDto getPlaceDetail(Long id) {
        Place place = placeMapper.findByIdWithAll(id);
        if (place == null) {
            throw new RuntimeException("해당 장소를 찾을 수 없습니다. ID: " + id);
        }

        PlaceSearchDto dto = new PlaceSearchDto();

        // 기본 필드 복사
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setDescription(place.getDescription());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        dto.setRegion(place.getRegion());
        dto.setOpenHours(place.getOpenHours());
        dto.setPetFriendly(place.isPetFriendly());
        dto.setPetVerified(place.isPetVerified());
        dto.setRestDays(place.getRestDays());
        dto.setPrice(place.getPrice());
        dto.setParking(place.getParking());
        dto.setPhone(place.getPhone());
        dto.setImageUrl(place.getImageUrl());
        dto.setHomePage(place.getHomePage());
        dto.setExternalContentId(place.getExternalContentId());
        dto.setSource(place.getSource());

        // 연관 정보
        dto.setPlaceType(place.getPlaceType());
        dto.setPlaceImages(place.getPlaceImages());
        dto.setReviews(place.getReviews());

        return dto;
    }
}
