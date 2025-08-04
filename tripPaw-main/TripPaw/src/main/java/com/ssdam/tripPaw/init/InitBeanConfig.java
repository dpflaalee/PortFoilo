package com.ssdam.tripPaw.init;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ssdam.tripPaw.badge.BadgeMapper;
import com.ssdam.tripPaw.category.CategoryMapper;
import com.ssdam.tripPaw.checklist.CheckTemplateItemMapper;
import com.ssdam.tripPaw.checklist.CheckTemplateMapper;
import com.ssdam.tripPaw.petpass.seal.SealMapper;
import com.ssdam.tripPaw.place.PlaceApiService;
import com.ssdam.tripPaw.place.PlaceTypeMapper;
import com.ssdam.tripPaw.review.ReviewTypeMapper;

@Configuration
public class InitBeanConfig {

    @Bean
    public TemplateDataInitializer templateDataInitializer(
        CheckTemplateMapper checkTemplateMapper,
        CheckTemplateItemMapper checkTemplateItemMapper,
        ReviewTypeMapper reviewTypeMapper
    ) {
        return new TemplateDataInitializer(checkTemplateMapper, checkTemplateItemMapper, reviewTypeMapper);
    }

    @Bean
    public PlaceInitializer placeInitializer(
        PlaceApiService placeApiService,
        CategoryMapper categoryMapper
    ) {
        return new PlaceInitializer(placeApiService, categoryMapper);
    }

    @Bean
    public BadgeInitializer badgeInitializer(BadgeMapper badgeMapper) {
        return new BadgeInitializer(badgeMapper);
    }

    @Bean
    public SealInitializer sealInitializer(
        SealMapper sealMapper,
        PlaceTypeMapper placeTypeMapper
    ) {
        return new SealInitializer(sealMapper, placeTypeMapper);
    }
}
