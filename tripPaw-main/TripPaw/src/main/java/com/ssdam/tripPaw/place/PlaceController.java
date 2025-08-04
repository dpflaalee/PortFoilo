package com.ssdam.tripPaw.place;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ssdam.tripPaw.category.CategoryService;
import com.ssdam.tripPaw.category.PlaceCategoryService;
import com.ssdam.tripPaw.domain.Category;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.dto.PlaceSearchDto;

import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
public class PlaceController {
	
	private final PlaceCategoryService placeCategoryService;
	private final CategoryService categoryService;
	private final PlaceService placeService;
	
	//해당 장소 상세 페이지
	@GetMapping("/place/{id}")
	public ResponseEntity<PlaceSearchDto> getPlaceDetail(@PathVariable Long id) {
		PlaceSearchDto dto = placeService.getPlaceDetail(id);
	return ResponseEntity.ok(dto);
	}
}
