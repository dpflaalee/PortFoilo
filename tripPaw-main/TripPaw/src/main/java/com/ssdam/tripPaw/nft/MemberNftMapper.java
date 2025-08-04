package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.MemberNft;

@Mapper
public interface MemberNftMapper {
    List<MemberNft> findByMemberId(Long memberId);
    void insert(MemberNft memberNft);
    void update(MemberNft memberNft);

    // soft delete 메서드로 변경 (deletedAt 컬럼에 현재시간 기록)
    void softDeleteByIdAndMemberId(@Param("id") Long id, @Param("memberId") String memberId);

    // soft delete: 사용 완료된 NFT들 삭제 처리
    void softDeleteUsedByNftMetadataId(@Param("nftMetadataId") Long nftMetadataId);
    
    // used 여부와 관계없이 모두 soft delete 처리
    void softDeleteAllByMetadataId(@Param("nftMetadataId") Long nftMetadataId);

    void giftNft(@Param("nftId") Long nftId, @Param("fromMemberId") Long fromMemberId, @Param("toMemberId") Long toMemberId);

    boolean existsByNftMetadataId(Long metadataId);

    void markAsUsed(@Param("id") Long id, @Param("usedAt") LocalDateTime usedAt);

    MemberNft findById(@Param("id") Long id);
    
    MemberNft findByTokenId(Long tokenId);
    
    // 특정 nftMetadataId가 이미 발급된 적 있는지 확인
    MemberNft findByNftMetadataId(Long nftMetadataId);

    int countUnusedByMetadataId(Long nftMetadataId);

    // 추가된 재사용 관련 메서드
    MemberNft findFirstSoftDeleted();

    void reuseSoftDeletedNft(MemberNft memberNft);
}
