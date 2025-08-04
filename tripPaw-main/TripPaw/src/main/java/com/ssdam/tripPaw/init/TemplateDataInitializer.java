package com.ssdam.tripPaw.init;
//체크리스트 더미데이터용 member 없으면 오류나니 최초 세팅 시 해당 코드 전체잠금 하시고 서버 돌리세요

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ssdam.tripPaw.checklist.CheckTemplateItemMapper;
import com.ssdam.tripPaw.checklist.CheckTemplateMapper;
import com.ssdam.tripPaw.domain.CheckTemplate;
import com.ssdam.tripPaw.domain.CheckTemplateItem;
import com.ssdam.tripPaw.review.ReviewTypeMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TemplateDataInitializer implements CommandLineRunner {
	
	private final CheckTemplateMapper checkTemplateMapper;
    private final CheckTemplateItemMapper checkTemplateItemMapper;	
    private final ReviewTypeMapper reviewTypeMapper;
	
	@Override
    public void run(String... args) throws Exception {
	    
	// 1. 리뷰타입 삽입
	reviewTypeMapper.insertReviewTypes();
	
	// 2. 체크템플릿은 중복 방지 후 삽입
	if (checkTemplateMapper.countTemplates() > 0) return;
	    
	// 이미 존재하는지 확인
	if (checkTemplateMapper.countTemplates() > 0) return;
	
	// 1. 템플릿 등록
	List<CheckTemplate> templates = List.of(
	    new CheckTemplate("기본 준비물",		 0, 1L, "250627"),
	    new CheckTemplate("건강, 위생",		 0, 1L, "250502"),
	    new CheckTemplate("숙소 및 장소 정보",	 0, 1L, "250403"),
	    new CheckTemplate("교통 수단 확인",		 0, 1L, "250404"),
	    new CheckTemplate("기타 유의사항",		 0, 1L, "250405"),
	    new CheckTemplate("공통 준비",			 1, 1L, "250406"),
	    new CheckTemplate("추움, 쌀쌀함",		 2, 1L, "250407"),
	    new CheckTemplate("쾌적한 날씨",		 3, 1L, "250408"),
	    new CheckTemplate("눈",			 	 4, 1L, "250409"),
	    new CheckTemplate("비",			 	 5, 1L, "250410")
	);
	templates.forEach(checkTemplateMapper::insertTemplate);

        // 2. 항목 등록
        List<CheckTemplateItem> items = List.of(
                new CheckTemplateItem(1L, "반려동물 사료 / 간식", "250601"),
                new CheckTemplateItem(1L, "급수 용품 (이동 중 물그릇 포함)", "250602"),
                new CheckTemplateItem(1L, "배변 패드 또는 배변 봉투", "250603"),
                new CheckTemplateItem(1L, "리드줄 / 하네스", "250604"),
                new CheckTemplateItem(1L, "휴대용 식기", "250605"),
                new CheckTemplateItem(1L, "장난감 또는 담요 (정서 안정용)", "250606"),
                
                new CheckTemplateItem(2L, "예방접종 여부 확인", "250607"),
                new CheckTemplateItem(2L, "반려동물 건강 상태 점검", "250608"),
                new CheckTemplateItem(2L, "기본 구급약품 준비", "250609"),
                new CheckTemplateItem(2L, "위생용품 (물티슈, 휴지 등)", "250610"),
                
                new CheckTemplateItem(3L, "숙소 위치 및 연락처 확인", "250611"),
                new CheckTemplateItem(3L, "숙소 반려동물 정책 확인", "250612"),
                new CheckTemplateItem(3L, "주변 편의 시설 확인", "250613"),
                new CheckTemplateItem(3L, "비상시 대체 숙소 파악", "250614"),
                
                new CheckTemplateItem(4L, "차량 점검 및 연료 확인", "250615"),
                new CheckTemplateItem(4L, "대중교통 시간표 및 경로 확인", "250616"),
                new CheckTemplateItem(4L, "주차 가능 여부 확인", "250617"),
                new CheckTemplateItem(4L, "이동 시 안전장비 준비", "250618"),
                
                new CheckTemplateItem(5L, "비상 연락처 메모", "250619"),
                new CheckTemplateItem(5L, "여행 보험 가입 여부 확인", "250620"),
                
                new CheckTemplateItem(6L, "여권 및 신분증 준비", "250621"),
                new CheckTemplateItem(6L, "현금 및 카드 준비", "250622"),
                new CheckTemplateItem(6L, "날씨 체크 및 옷차림 준비", "250623"),
                new CheckTemplateItem(6L, "휴대폰 충전기 및 보조배터리", "250624"),
                
                new CheckTemplateItem(7L, "보온 의류 준비", "250625"),
                new CheckTemplateItem(7L, "방한 용품 (장갑, 모자 등)", "250626"),
                new CheckTemplateItem(7L, "난방용품 준비", "250627"),
                new CheckTemplateItem(7L, "추위에 약한 반려동물 보호", "250628"),
                
                new CheckTemplateItem(8L, "가벼운 옷차림 준비", "250629"),
                new CheckTemplateItem(8L, "햇빛 차단 용품 준비", "250630"),
                new CheckTemplateItem(8L, "물놀이 용품 준비", "250630"),
                new CheckTemplateItem(8L, "야외 활동 장비 준비", "250530"),
                
                new CheckTemplateItem(9L, "눈길 대비 신발 준비", "250630"),
                new CheckTemplateItem(9L, "눈 치우기 도구 준비", "250630"),
                new CheckTemplateItem(9L, "미끄럼 방지 용품 준비", "250630"),
                new CheckTemplateItem(9L, "추운 날씨 대비 장비 준비", "250630"),
                
                new CheckTemplateItem(10L, "우비 또는 방수 장비", "250630"),
                new CheckTemplateItem(10L, "방수 신발 또는 덮개", "250630"),
                new CheckTemplateItem(10L, "우산 또는 차양막 준비", "250630"),
                new CheckTemplateItem(10L, "습기 제거제 (차량 내 또는 숙소용)", "250630")
            );
            items.forEach(checkTemplateItemMapper::insertTemplateItem);
    }

}
