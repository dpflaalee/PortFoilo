package com.ssdam.tripPaw.place;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.PlaceType;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/place-types")
public class PlaceTypeController {
	private final PlaceTypeService placeTypeService;
	
	@GetMapping
	public List<PlaceType> getAllPlaceTypes() {
		return placeTypeService.getAllPlaceTypes();
	}
}
