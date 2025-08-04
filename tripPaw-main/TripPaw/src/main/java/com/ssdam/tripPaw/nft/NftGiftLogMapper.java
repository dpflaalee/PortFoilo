package com.ssdam.tripPaw.nft;

import java.util.List;
import com.ssdam.tripPaw.domain.NftGiftLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NftGiftLogMapper {
    List<NftGiftLog> findSentLogsBySenderId(Long senderId);
    List<NftGiftLog> findReceivedLogsByReceiverId(Long receiverId);
    void insert(NftGiftLog nftGiftLog);
    void deleteById(Long id);
}
