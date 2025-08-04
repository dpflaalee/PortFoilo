package com.ssdam.tripPaw.init;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.ssdam.tripPaw.domain.PlaceType;
import com.ssdam.tripPaw.domain.Seal;
import com.ssdam.tripPaw.petpass.seal.SealMapper;
import com.ssdam.tripPaw.place.PlaceTypeMapper;

import lombok.RequiredArgsConstructor;

public class SealInitializer {
	
    private final SealMapper sealMapper;
    private final PlaceTypeMapper placeTypeMapper;

    public SealInitializer(SealMapper sealMapper, PlaceTypeMapper placeTypeMapper) {
        this.sealMapper = sealMapper;
        this.placeTypeMapper = placeTypeMapper;
    }
    
    public void run() {
        if (sealMapper.countSealsByName("관광지 도장 A") > 0) {
            System.out.println("도장 더미 이미 존재함, 초기화 생략");
            return;}

        insertSealsFor("관광지", 1L, List.of(
            "/uploads/seals/travel.png",
            "/uploads/seals/travel2.png",
            "/uploads/seals/travel3.png",
            "/uploads/seals/travel4.png"
        ));

        insertSealsFor("문화시설", 2L, List.of(
            "/uploads/seals/culture.png",
            "/uploads/seals/culture2.png",
            "/uploads/seals/culture3.png"
        ));

        insertSealsFor("레포츠", 3L, List.of(
            "/uploads/seals/leports1.png",
            "/uploads/seals/leports2.png",
            "/uploads/seals/leports3.png"
        ));

        insertSealsFor("숙박", 4L, List.of(
            "/uploads/seals/lodgment.png",
            "/uploads/seals/lodgment2.png",
            "/uploads/seals/lodgment3.png"
        ));

        insertSealsFor("쇼핑", 5L, List.of(
                "/uploads/seals/shopping.png",
                "/uploads/seals/shopping2.png",
                "/uploads/seals/shopping3.png"
        ));

//        insertSealsFor("음식점", 6L, List.of(
//        ));

        System.out.println("✅ 도장 더미 삽입 완료");
    }

    private void insertSealsFor(String categoryName, Long typeId, List<String> imageUrls) {
        PlaceType type = new PlaceType();
        type.setId(typeId); // 직접 ID 설정

        for (int i = 0; i < imageUrls.size(); i++) {
            Seal seal = new Seal();
            seal.setName(categoryName + " 도장 " + (char)('A' + i));
            seal.setImageUrl(imageUrls.get(i));
            seal.setPlaceType(type);

            sealMapper.insert(seal);
        }
    }
}
