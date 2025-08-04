package com.ssdam.tripPaw.pay;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.PayShare;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservState;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayShareService {
	
	private final PayShareMapper payShareMapper;
	private final PayMapper payMapper;
	private final ReservMapper reservMapper;
	
    public List<PayShare> findAll() {	
        return payShareMapper.findAll();
    }
    
    public PayShare findById(Long payId) {
        return payShareMapper.findById(payId);
    }

    public PayShare findByReservIdAndMember(Long reservId, Member member) {
        return payShareMapper.findByReservIdAndMember(reservId, member.getId());
    }
    
    public List<Member> getParticipantsByReservId(Long reservId) {
        return payShareMapper.findParticipantsByPayId(reservId); // PayShareMapper에서 참가자 조회
    }
    
    @Transactional
    public void joinDutchPay(Long reservId, Member member) {
        Pay pay = payMapper.findByReservId(reservId);
        if (pay == null) {
            throw new IllegalArgumentException("해당 예약에 대한 결제가 존재하지 않습니다.");
        }

        Reserv reserv = pay.getReserv();
        int totalPeople = reserv.getCountPeople();

        // 중복 참여 방지
        PayShare existing = payShareMapper.findByPayIdAndMemberId(pay.getId(), member.getId());
        if (existing != null) {
            throw new IllegalStateException("이미 참여한 사용자입니다.");
        }

        // 인원 수 초과 방지
        int currentParticipants = payShareMapper.countByPayId(pay.getId());
        if (currentParticipants >= totalPeople) {
            throw new IllegalStateException("더 이상 참여할 수 없습니다. 인원이 모두 찼습니다.");
        }

        int shareAmount = pay.getAmount() / totalPeople;

        PayShare share = new PayShare();
        share.setPay(pay);
        share.setMember(member);
        share.setAmount(shareAmount);
        share.setHasPaid(false);
        share.setCreatedAt(LocalDateTime.now());

        payShareMapper.insert(share);
    }
    
    @Transactional
    public Pay createDutchPay(Long reservId, Member owner, List<Member> participants) {
        Reserv reserv = reservMapper.findById(reservId);
        if (reserv == null) {
            throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
        }

        int totalAmount = reserv.getFinalPrice();
        int totalPeople = reserv.getCountPeople(); // 예약 인원을 총 인원으로 사용
        int shareAmount = totalAmount / totalPeople;

        Pay pay = new Pay();
        pay.setReserv(reserv);
        pay.setMember(owner);  // 방장
        pay.setAmount(totalAmount);
        pay.setPayMethod("DUTCH");
        pay.setPgProvider("DUTCH");
        pay.setState(PayState.READY);
        pay.setCreatedAt(LocalDateTime.now());
        pay.setHaspayShare(true);

        payMapper.insert(pay);

        // 초기에 방장 1명만 등록 (참여자는 나중에 /join 통해 합류)
        PayShare ownerShare = new PayShare();
        ownerShare.setPay(pay);
        ownerShare.setMember(owner);
        ownerShare.setAmount(shareAmount);
        ownerShare.setHasPaid(false);
        ownerShare.setCreatedAt(LocalDateTime.now());
        payShareMapper.insert(ownerShare);

        return pay;
    }
    
    @Transactional
    public void completePayShare(Long payShareId, Member member) {
        PayShare payShare = payShareMapper.findById(payShareId);
        if (payShare == null) {
            throw new IllegalArgumentException("결제 항목이 존재하지 않습니다.");
        }

        if (!payShare.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 결제가 아닙니다.");
        }

        payShare.setHasPaid(true);
        payShare.setPaidAt(LocalDateTime.now());
        payShareMapper.update(payShare);

        // 모든 참여자가 결제 완료했는지 확인
        Long payId = payShare.getPay().getId();
        int unpaidCount = payShareMapper.countUnpaidByPayId(payId);

        if (unpaidCount == 0) {
            Pay pay = payMapper.findById(payId);
            pay.setState(PayState.PAID);
            payMapper.updateByState(pay);

            // 예약 상태도 CONFIRMED로 변경
            Reserv reserv = pay.getReserv();
            reserv.setState(ReservState.CONFIRMED);
            reservMapper.updateByState(reserv);
        }
    }
    
}
