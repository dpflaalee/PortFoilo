package com.ssdam.tripPaw.nft;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.MemberNft;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/member-nft")
@RequiredArgsConstructor
public class MemberNftController {

    private final MemberNftService memberNftService;

    // 특정 멤버의 NFT 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<List<MemberNftDto>> getMemberNfts(@PathVariable Long memberId) {
        List<MemberNft> memberNfts = memberNftService.getMemberNfts(memberId);

        List<MemberNftDto> dtos = memberNfts.stream()
            .map(nft -> new MemberNftDto(
                 nft.getId(),
                 nft.getNftMetadata().getTitle(),
                 nft.getTokenId(), 
                 nft.getNftMetadata().getImageUrl(),
                 nft.getNftMetadata().getPointValue(),
                 nft.getUsedAt(),
                 nft.getBarcode(),             
                 nft.getIssuedAt(),             
                 nft.getDueAt(),
                 nft.getIssuedReason(),
                 nft.getDeletedAt() // soft delete 컬럼 추가
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // NFT 발급
    @PostMapping("/issue-or-reuse")
    public ResponseEntity<String> issueOrReuseNft(@RequestBody MemberNft memberNft) {
        memberNftService.issueOrReuseNft(memberNft);
        return ResponseEntity.ok("NFT issued or reused successfully");
    }

    // NFT 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateNft(@PathVariable Long id, @RequestBody MemberNft memberNft) {
        memberNft.setId(id);
        memberNftService.updateNft(memberNft);
        return ResponseEntity.ok("NFT updated");
    }

    // NFT 사용 처리
    @PostMapping("/use/{id}")
    public ResponseEntity<String> useNft(@PathVariable Long id) {
        memberNftService.markAsUsed(id);
        return ResponseEntity.ok("NFT marked as used");
    }
    
    // 유저가 자신의 NFT soft delete 처리 (삭제)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNft(@PathVariable Long id, @RequestParam String memberId) {
        memberNftService.softDeleteMemberNft(id, memberId);
        return ResponseEntity.ok("NFT soft deleted");
    }
    
    // 관리자: 사용 완료된 NFT만 soft delete 처리
    @DeleteMapping("/metadata/{nftMetadataId}/used-nfts")
    public ResponseEntity<String> deleteUsedNftsByMetadata(@PathVariable Long nftMetadataId) {
        memberNftService.softDeleteUsedByNftMetadataId(nftMetadataId);
        return ResponseEntity.ok("사용 완료된 NFT soft delete 완료");
    }
    
    // NFT 선물 기능
    @PostMapping("/gift/{nftId}")
    public ResponseEntity<String> giftNft(@PathVariable Long nftId,
                                          @RequestParam Long fromMemberId,
                                          @RequestParam String toNickname,
                                          @RequestBody(required = false) Map<String, String> requestBody) {
        try {
            String message = requestBody != null ? requestBody.get("message") : null;
            memberNftService.giftNftByNickname(nftId, fromMemberId, toNickname, message);
            return ResponseEntity.ok("NFT gifted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("NFT gift failed: " + e.getMessage());
        }
    }
}
