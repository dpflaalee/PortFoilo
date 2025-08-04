package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Seal;
import com.ssdam.tripPaw.review.FileUploadService;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class SealService {
	
    private final SealMapper sealMapper;
    private final FileUploadService fileUploadService;

    // 전체 도장 조회
    public List<Seal> getAllSeals() { return sealMapper.findAll(); }

    // 장소 타입별 도장 조회
    public List<Seal> getSealsByPlaceType(Long placeTypeId) { return sealMapper.findByPlaceTypeId(placeTypeId); }

    // 단건 조회
    public Seal getSealById(Long id) { return sealMapper.findById(id);}

    // 도장 등록
    public void createSeal(Seal seal) { sealMapper.insert(seal); }

    // 도장 수정
    public void updateSeal(Seal seal) {sealMapper.update(seal);}

    // 도장 삭제
    public void deleteSeal(Long id) { 
    	Seal seal = sealMapper.findById(id);
        if (seal == null) {
            throw new IllegalArgumentException("존재하지 않는 도장 ID: " + id);
        }

        String imageUrl = seal.getImageUrl(); // 예: /uploads/seals/uuid.png
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            String relativePath = imageUrl.replaceFirst("/uploads/", ""); // "seals/uuid.png"
            fileUploadService.delete(relativePath); // 실제 파일 삭제
        }
        
    	sealMapper.delete(id);
    }
    
    ////placeType로 도장 조회
    public List<Seal> getSealsByTripPlan(Long memberTripPlanId) {
        return sealMapper.findSealsByTripPlanId(memberTripPlanId);
    }
    
    public List<Seal> getUnacquiredSealsByTrip(Long tripPlanId, Long passportId) {
        return sealMapper.findUnacquiredSealsByTripPlanId(tripPlanId, passportId);
    }

	
}
