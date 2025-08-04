package com.ssdam.tripPaw.place;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.PlaceImage;

@Mapper
public interface PlaceImageMapper {
    int insert(PlaceImage placeImage);
}
