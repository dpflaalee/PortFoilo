package com.ssdam.tripPaw.category;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.Category;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CategroryController {
	private final CategoryService categoryService;
	
	@GetMapping("/category")
	public ResponseEntity<List<Category>> getAllCategory() {
		List<Category> categories = categoryService.findAll();
		if(categories == null) {
			return ResponseEntity.notFound().build();			
		}
		return ResponseEntity.ok(categories);			
	}
}
