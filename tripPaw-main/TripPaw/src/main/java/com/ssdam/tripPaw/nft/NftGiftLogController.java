package com.ssdam.tripPaw.nft;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.ssdam.tripPaw.domain.NftGiftLog;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/nft/gifts")
@RequiredArgsConstructor
public class NftGiftLogController {

    private final NftGiftLogService nftGiftLogService;

    // 내가 보낸 선물 리스트
    @GetMapping("/sent/{senderId}")
    public List<NftGiftLog> getSentLogs(@PathVariable Long senderId) {
        return nftGiftLogService.findSentLogsBySenderId(senderId);
    }

    // 내가 받은 선물 리스트
    @GetMapping("/received/{receiverId}")
    public List<NftGiftLog> getReceivedLogs(@PathVariable Long receiverId) {
        return nftGiftLogService.findReceivedLogsByReceiverId(receiverId);
    }

    // 선물 기록 생성
    @PostMapping
    public void createGiftLog(@RequestBody NftGiftLog giftLog) {
        nftGiftLogService.createGiftLog(giftLog);
    }

    // 선물 기록 삭제 (관리자 등)
    @DeleteMapping("/{id}")
    public void deleteGiftLog(@PathVariable Long id) {
        nftGiftLogService.deleteGiftLog(id);
    }
}
