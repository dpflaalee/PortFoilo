package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.PassportSeal;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/passport-seals") @RequiredArgsConstructor
public class PassportSealController {
	private final PassportSealService passportSealService;

    // 도장 등록
    @PostMapping
    public ResponseEntity<?> addPassportSeal(@RequestBody PassportSeal passportSeal) {
        System.out.println("📦 passportSeal = " + passportSeal);
        System.out.println("📌 passportSeal.review = " + passportSeal.getReview());
        System.out.println("🆔 review.id = " + (passportSeal.getReview() != null ? passportSeal.getReview().getId() : "null"));

        passportSealService.addPassportSeal(passportSeal);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 도장 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<PassportSeal> getPassportSeal(@PathVariable Long id) {
        PassportSeal seal = passportSealService.getPassportSeal(id);
        if (seal == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(seal);
    }

    // 여권 ID로 도장 리스트 조회
    @GetMapping("/passport/{passportId}")
    public ResponseEntity<List<PassportSeal>> getSealsByPassport(@PathVariable Long passportId) {
        return ResponseEntity.ok(passportSealService.getPassportSealsByPassportId(passportId));
    }

    // 도장 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePassportSeal(@PathVariable Long id) {
        passportSealService.deletePassportSeal(id);
        return ResponseEntity.noContent().build();
    }
}
