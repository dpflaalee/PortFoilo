package com.ssdam.tripPaw.nft;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ssdam.tripPaw.domain.NftGiftLog;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NftGiftLogService {

    private final NftGiftLogMapper nftGiftLogMapper;

    public List<NftGiftLog> findSentLogsBySenderId(Long senderId) {
        return nftGiftLogMapper.findSentLogsBySenderId(senderId);
    }

    public List<NftGiftLog> findReceivedLogsByReceiverId(Long receiverId) {
        return nftGiftLogMapper.findReceivedLogsByReceiverId(receiverId);
    }

    @Transactional
    public void createGiftLog(NftGiftLog giftLog) {
        nftGiftLogMapper.insert(giftLog);
    }

    @Transactional
    public void deleteGiftLog(Long id) {
        nftGiftLogMapper.deleteById(id);
    }
}
