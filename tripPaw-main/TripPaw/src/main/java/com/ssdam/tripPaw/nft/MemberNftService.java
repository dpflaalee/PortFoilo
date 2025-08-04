package com.ssdam.tripPaw.nft;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberNft;
import com.ssdam.tripPaw.domain.NftGiftLog;
import com.ssdam.tripPaw.member.MemberMapper;
import com.ssdam.tripPaw.member.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberNftService {

    private final MemberNftMapper memberNftMapper;
    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final NftGiftLogService nftGiftLogService;

    // 특정 멤버의 NFT 조회 (deletedAt IS NULL 조건 추가 필요)
    public List<MemberNft> getMemberNfts(Long memberId) {
        return memberNftMapper.findByMemberId(memberId)
            .stream()
            .filter(nft -> nft.getUsedAt() == null && nft.getDeletedAt() == null)  // soft delete 체크 추가
            .collect(Collectors.toList());
    }

    // NFT 발급
    public void issueOrReuseNft(MemberNft memberNft) {
    	
    	// 중복 발급 방지
        MemberNft existing = memberNftMapper.findByNftMetadataId(memberNft.getNftMetadata().getId());
        if (existing != null) {
            throw new IllegalStateException("이미 발급된 NFT입니다.");
        }
    	
        // 1. soft delete 된 재사용 가능한 NFT 조회
        MemberNft reusableNft = memberNftMapper.findFirstSoftDeleted();

        if (reusableNft != null) {
            // 2. 기존 soft deleted NFT 재사용: 정보 업데이트 + deleted_at, used_at 초기화
            reusableNft.setMember(memberNft.getMember());
            reusableNft.setNftMetadata(memberNft.getNftMetadata());
            reusableNft.setWalletAddress(memberNft.getWalletAddress());
            reusableNft.setBarcode(memberNft.getBarcode() != null ? memberNft.getBarcode() : generateBarcode());
            reusableNft.setDueAt(LocalDateTime.now().plusMonths(1));
            reusableNft.setIssuedReason(memberNft.getIssuedReason());
            reusableNft.setTxHash(memberNft.getTxHash());
            reusableNft.setIssuedAt(LocalDateTime.now());
            reusableNft.setUsedAt(null);
            reusableNft.setDeletedAt(null);  // 복구 처리

            memberNftMapper.reuseSoftDeletedNft(reusableNft);
        } else {
            // 3. 없으면 신규 발급
            if (memberNft.getBarcode() == null || memberNft.getBarcode().isEmpty()) {
                memberNft.setBarcode(generateBarcode());
            }
            LocalDateTime now = LocalDateTime.now();
            memberNft.setIssuedAt(now);
            memberNft.setDueAt(now.plusMonths(1));
            memberNftMapper.insert(memberNft);
        }
    }

    private String generateBarcode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    // NFT 수정
    public void updateNft(MemberNft memberNft) {
        memberNftMapper.update(memberNft);
    }

    // NFT 사용 처리 + 포인트 적립
    public void markAsUsed(Long id) {
        LocalDateTime now = LocalDateTime.now();
        memberNftMapper.markAsUsed(id, now);

        MemberNft nft = memberNftMapper.findById(id);
        if (nft != null && nft.getNftMetadata() != null && nft.getMember() != null) {
            int points = nft.getNftMetadata().getPointValue();
            Long memberId = nft.getMember().getId();
            memberService.addPoints(memberId, points);
        }
    }

    // soft delete 처리: 유저 NFT 삭제
    public void softDeleteMemberNft(Long id, String memberId) {
        LocalDateTime now = LocalDateTime.now();
        memberNftMapper.softDeleteByIdAndMemberId(id, memberId);
    }

    // soft delete 처리: 관리자용 사용 완료 NFT 삭제
    public void softDeleteUsedByNftMetadataId(Long nftMetadataId) {
        LocalDateTime now = LocalDateTime.now();
        memberNftMapper.softDeleteUsedByNftMetadataId(nftMetadataId);
    }

    // NFT 선물 기능 (기존 그대로)
    public void giftNftByNickname(Long nftId, Long fromMemberId, String toNickname, String message) {
        MemberNft nft = memberNftMapper.findById(nftId);
        if (nft == null) {
            throw new IllegalArgumentException("해당 NFT가 존재하지 않습니다.");
        }
        if (!nft.getMember().getId().equals(fromMemberId)) {
            throw new IllegalArgumentException("NFT 소유자가 아닙니다.");
        }
        if (nft.getUsedAt() != null) {
            throw new IllegalArgumentException("이미 사용된 NFT는 선물할 수 없습니다.");
        }

        Member toMember = memberMapper.findByNickname(toNickname);
        if (toMember == null) {
            throw new IllegalArgumentException("선물받을 사용자가 존재하지 않습니다.");
        }

        if (toMember.getId().equals(fromMemberId)) {
            throw new IllegalArgumentException("본인에게는 NFT를 선물할 수 없습니다.");
        }

        memberNftMapper.giftNft(nftId, fromMemberId, toMember.getId());

        NftGiftLog giftLog = new NftGiftLog();
        giftLog.setMemberNft(nft);
        giftLog.setSender(memberService.findById(fromMemberId));
        giftLog.setReceiver(toMember);
        giftLog.setMessage(message != null ? message : "NFT 선물");

        nftGiftLogService.createGiftLog(giftLog);
    }
}
