package com.ssdam.tripPaw.nft;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nft")
@RequiredArgsConstructor
public class NFTController {

    private final NFTService nftService;

    // 기존 블록체인에서 직접 NFT 토큰 조회 API
    @GetMapping("/tokens")
    public ResponseEntity<?> getNFTs(
            @RequestParam String contractAddress,
            @RequestParam String walletAddress) {
        try {
            return ResponseEntity.ok(nftService.getNFTs(contractAddress, walletAddress));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // 신규 - 블록체인 API에서 NFT 조회 후 DB 저장/갱신 처리 (동기화)
    @PostMapping("/sync-tokens")
    public ResponseEntity<?> syncTokens(
            @RequestParam String contractAddress,
            @RequestParam String walletAddress) {
        try {
            List<?> savedList = nftService.syncTokensToDb(contractAddress, walletAddress);
            return ResponseEntity.ok(savedList);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "동기화 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // DB에서 저장된 nft_metadata 전체 리스트 조회 API (관리용) - 발급 여부 포함
    @GetMapping("/metadata")
    public ResponseEntity<?> getAllNftMetadata() {
        try {
            List<Map<String, Object>> nftListWithIssued = nftService.getAllNftMetadata(); 
            return ResponseEntity.ok(nftListWithIssued);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "조회 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    
    // nft_metadata 수정 API (point_value 등)
    @PutMapping("/metadata/{id}")
    public ResponseEntity<?> updateNftMetadata(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            nftService.updateNftMetadata(id, updates);
            return ResponseEntity.ok(Map.of("result", "수정 완료"));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "수정 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // nft_metadata 삭제 API
    @DeleteMapping("/metadata/{id}")
    public ResponseEntity<?> deleteNftMetadata(@PathVariable Long id) {
        try {
            nftService.deleteNftMetadataAndUsedCoupons(id);
            return ResponseEntity.ok(Map.of("result", "삭제 완료"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));  // 사용자 친화적 메시지 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "삭제 중 오류 발생: " + e.getMessage()));
        }
    }
    
    // 관리자용 강제 삭제 API (사용 여부 무시)
    @DeleteMapping("/metadata/{id}/force")
    public ResponseEntity<?> forceDeleteNftMetadata(@PathVariable Long id) {
        try {
            nftService.forceDeleteNftMetadata(id);
            return ResponseEntity.ok(Map.of("result", "강제 삭제 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "강제 삭제 실패: " + e.getMessage()));
        }
    }
}
