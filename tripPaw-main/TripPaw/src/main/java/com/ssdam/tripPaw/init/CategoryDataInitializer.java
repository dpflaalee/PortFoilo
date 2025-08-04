package com.ssdam.tripPaw.init;

import com.ssdam.tripPaw.category.CategoryMapper;
import com.ssdam.tripPaw.domain.Category;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryDataInitializer implements ApplicationRunner {

    private final CategoryMapper categoryMapper;

    public CategoryDataInitializer(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    
    @Override
    public void run(ApplicationArguments args) {
    	// 이미 존재하는지 확인
    	if (categoryMapper.countCategories() > 0) return;
    	
    	List<String> categoryNames = List.of(
    		    "한적한", "힐링", "감성 인스타", "로맨틱", "레트로", "빈티지 감성",
    		    "오션뷰", "숲속 감성", "새소리 들리는", "노을 맛집", "자연광 가득", "계절별 인생샷 명소",

    		    "당일치기", "1박 2일", "2박 3일", "3박 4일", "장기여행", "무계획 여행",
    		    "혼행 (혼자 여행)", "커플 여행", "가족 여행",

    		    "캠핑", "차박", "도보 여행", "애견동반 글램핑", "자차 여행", "뚜벅이 여행",

    		    "모험/도전", "역사 탐방", "문화예술 체험", "이색 체험", "출사 여행", "브이로그 촬영지",
    		    "휴양 중심", "체험 위주", "쇼핑 중심", "시장/전통거리", "노포 맛집 탐방", "로컬 라이프 체험",
    		    "번아웃 회복", "워케이션", "스몰 럭셔리", "고급/럭셔리 여행", "혼잡도 낮은 장소",

    		    "먹방 여행",

    		    "트레킹/등산", "서핑/수상 스포츠",

    		    "날씨 좋은 날 추천", "비 오는 날 추천", "겨울철 한정", "여름철 한정", "사계절 내내 좋은",
    		    "야간 개장 장소", "명상/요가 가능한 장소",

    		    "영화/드라마 촬영지", "사진 찍기 좋은", "SNS 핫플",

    		    "해변/바다", "산/계곡", "도시/야경", "전망대", "수목원", "섬 여행지",
    		    "해안 산책로", "마을 골목"
    		);


        for (String name : categoryNames) {
            if (categoryMapper.findByName(name) == null ) {
                Category category = new Category();
                category.setName(name);
                categoryMapper.insert(category);
            }
        }
        
    }
}
