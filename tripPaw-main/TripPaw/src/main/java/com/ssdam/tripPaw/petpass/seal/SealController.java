package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.Seal;

import lombok.RequiredArgsConstructor;

@RestController @RequiredArgsConstructor @RequestMapping("/api/seals")
public class SealController {
	
    private final SealService sealService;

    // 전체 도장 조회
    @GetMapping
    public List<Seal> getAllSeals() {
        return sealService.getAllSeals();
    }

    // 장소 타입별 도장 조회
    @GetMapping("/place-type/{placeTypeId}")
    public List<Seal> getSealsByPlaceType(@PathVariable Long placeTypeId) {
        return sealService.getSealsByPlaceType(placeTypeId);
    }

    // 단일 도장 조회
    @GetMapping("/{id}")
    public Seal getSealById(@PathVariable Long id) {
        return sealService.getSealById(id);
    }

    // 도장 등록
    @PostMapping
    public ResponseEntity<String> createSeal(@RequestBody Seal seal) {
        sealService.createSeal(seal);
        return ResponseEntity.ok("도장이 등록되었습니다.");
    }

    // 도장 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSeal(@PathVariable Long id, @RequestBody Seal seal) {
        seal.setId(id);
        sealService.updateSeal(seal);
        return ResponseEntity.ok("도장이 수정되었습니다.");
    }

    // 도장 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeal(@PathVariable Long id) {
        sealService.deleteSeal(id);
        return ResponseEntity.ok("도장이 삭제되었습니다.");
    }
    
    //placeType로 도장 조회
    @GetMapping("/tripplan/{memberTripPlanId}")
    public ResponseEntity<List<Seal>> getSealsByTripPlanId(@PathVariable Long memberTripPlanId) {
        List<Seal> seals = sealService.getSealsByTripPlan(memberTripPlanId);
        return ResponseEntity.ok(seals);
    }
    
    @GetMapping("/tripplan/trip/{tripPlanId}/passport/{passportId}")
    public ResponseEntity<List<Seal>> getUnacquiredSealsByTrip(@PathVariable Long tripPlanId,
                                                               @PathVariable Long passportId) {
        List<Seal> seals = sealService.getUnacquiredSealsByTrip(tripPlanId, passportId);
        return ResponseEntity.ok(seals);
    }



}
