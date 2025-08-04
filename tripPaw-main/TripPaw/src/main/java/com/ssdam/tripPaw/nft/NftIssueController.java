package com.ssdam.tripPaw.nft;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/nft")
@RequiredArgsConstructor
public class NftIssueController {

    private final NftIssueService nftIssueService;

    @PostMapping("/issue-to-member")
    public ResponseEntity<String> issueToSpecificMember(
        @RequestParam Long nftMetadataId,
        @RequestParam String nickname,
        @RequestParam String issuedReason) {
      try {
        nftIssueService.issueToMemberByNickname(nftMetadataId, nickname, issuedReason);
        return ResponseEntity.ok("NFT 발급 성공");
      } catch (Exception e) {
        return ResponseEntity.status(500).body("NFT 발급 실패: " + e.getMessage());
      }
    }
}
