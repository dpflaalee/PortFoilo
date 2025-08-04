package com.ssdam.tripPaw.petpassport;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.PetPassport;

import lombok.RequiredArgsConstructor;


@RestController @RequiredArgsConstructor @RequestMapping("/api/passports")
public class PetPassportController  {
	
	private final PetPassportService petPassportService;

    // 1. 여권 등록
    @PostMapping
    public void createPassport(@RequestBody PetPassport passport) {
        petPassportService.createPassport(passport);
    }

    // 2. 단건 조회
    @GetMapping("/{passportId}")
    public PetPassport getPassportById(@PathVariable Long passportId) {
        return petPassportService.getPassportById(passportId);
    }

    // 3. 유저 ID로 여권 전체 조회
    @GetMapping("/member/{memberId}")
    public List<PetPassport> getPassportsByMemberId(@PathVariable Long memberId) {
        return petPassportService.getPassportsByMemberId(memberId);
    }

    // 4. 여권 상세 조회 (도장 포함)
    @GetMapping("/{passportId}/seals")
    public PetPassport getPassportWithSeals(@PathVariable Long passportId) {
        return petPassportService.getPassportWithSeals(passportId);
    }

    // 5. 여권번호 중복 체크
    @GetMapping("/check-passnum")
    public boolean checkDuplicatePassNum(@RequestParam String passNum) {
        return petPassportService.isPassNumDuplicate(passNum);
    }

    // 6. 여권 수정
    @PutMapping("/{passportId}")
    public void updatePassport(@PathVariable Long passportId, @RequestBody PetPassport passport) {
        passport.setId(passportId);
        petPassportService.updatePassport(passport);
    }

    // 7. 여권 삭제
    @DeleteMapping("/{passportId}")
    public void deletePassport(@PathVariable Long passportId) {
        petPassportService.deletePassport(passportId);
    }

}
