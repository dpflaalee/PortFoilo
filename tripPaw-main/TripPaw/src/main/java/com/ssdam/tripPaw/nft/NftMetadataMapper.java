package com.ssdam.tripPaw.nft;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.ssdam.tripPaw.domain.NftMetadata;

@Mapper
public interface NftMetadataMapper {
    List<NftMetadata> findAll();
    NftMetadata findById(Long id);
    NftMetadata findByTokenId(Long tokenId);
    void insert(NftMetadata nftMetadata);
    void update(NftMetadata nftMetadata);
    void delete(Long id);
    void softDelete(Long id);
    boolean existsByTitle(String title);
    
    // 사용되지 않은 NFT 중 가장 token_id가 작은 것 1개 반환
    NftMetadata findFirstUnused();
}
