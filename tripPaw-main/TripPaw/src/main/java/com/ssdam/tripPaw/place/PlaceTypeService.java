package com.ssdam.tripPaw.place;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.PlaceType;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class PlaceTypeService {
	private final PlaceTypeMapper placeTypeMapper;
	
	public List<PlaceType> getAllPlaceTypes() {
		return placeTypeMapper.findAll();
	}
}
