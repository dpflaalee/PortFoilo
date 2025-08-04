package com.ssdam.tripPaw.init;

import java.net.URISyntaxException;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.ssdam.tripPaw.category.CategoryMapper;
import com.ssdam.tripPaw.place.PlaceApiService;

public class PlaceInitializer implements ApplicationRunner {
	private final CategoryMapper categoryMapper;
    private final PlaceApiService placeApiService;

    public PlaceInitializer(PlaceApiService placeApiService, CategoryMapper categoryMapper) {
        this.placeApiService = placeApiService;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public void run(ApplicationArguments args) throws URISyntaxException, InterruptedException {
        if (args.containsOption("initAll")) {
            System.out.println("[INFO] 장소 초기화 시작");
            placeApiService.fetchAndSavePetFriendlyPlaces();
            System.out.println("[INFO] 장소 초기화 완료");
        } else {
            System.out.println("[INFO] 장소 초기화 건너뜀");
        }
    }
}