package com.ssdam.tripPaw.pay;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.exception.IamportResponseException;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.PayShare;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.dto.PayResponseDto;
import com.ssdam.tripPaw.payapi.IamportPayService;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservService;
import com.ssdam.tripPaw.reserv.ReservState;
import com.ssdam.tripPaw.tripPlan.TripPlanMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayService {
    private final PayMapper payMapper;
    private final ReservMapper reservMapper;
    private final IamportPayService iamportPayService;
    private final PayShareMapper payShareMapper;
    private final TripPlanMapper tripPlanMapper;
    private final ReservService reservService;

    
    /** 결제 조회 */
    public Pay findById(Long id) {
        return payMapper.findById(id);
    }

    /** 결제 전체 조회 */
    public List<Pay> findAll() {
        return payMapper.findAll();
    }

    public Pay findByReservId(Long reservId) {
        return payMapper.findByReservId(reservId);
    }
    
    public Pay findByImpUid(String impUid) {
        return payMapper.findByImpUid(impUid);
    }
    
    /** 결제 정보 저장 */
    @Transactional
    public int createPay(Pay pay, Long tripPlanId, Boolean isGroup) {
        if (pay.getCreatedAt() == null) {
            pay.setCreatedAt(LocalDateTime.now());
        }

        // 그룹 결제일 경우
        if (isGroup != null && isGroup) {
            pay.setIsGroup(true);  // 그룹 결제
            pay.setGroupId(tripPlanId);  // 그룹 ID 설정
            
        } else {
            pay.setIsGroup(false);  // 기본값은 단일 결제
            pay.setGroupId(null);  // 그룹 ID는 null
        }
        
        int result = payMapper.insert(pay);

        // 2. 단일 예약일 경우 reserv에 연결
        if (!pay.getIsGroup() && pay.getReserv() != null && pay.getReserv().getId() != null) {
            Long reservId = pay.getReserv().getId();
            reservMapper.updatePayIdByReservId(pay.getId(), reservId); // pay_id 업데이트
        }

        return result;
    }

    /** 결제 상태 업데이트 (예: 결제 완료 → 환불 등) */
    @Transactional
    public int updatePayState(Long id, PayState newState) {
        Pay pay = payMapper.findById(id);
        if (pay == null) {
            throw new IllegalArgumentException("해당 결제 내역이 존재하지 않습니다: " + id);
        }

        pay.setState(newState);
        return payMapper.updateByState(pay);
    }


    /** 일괄 결제 */
    public List<PayResponseDto> createBatchPayDtosByMemberTripPlan(Long memberTripPlanId, Member member) throws Exception {
        List<Reserv> reservList = reservMapper.findByMemberTripPlanIdAndMember(memberTripPlanId, member.getId());

        Long groupId = memberTripPlanId;
        List<PayResponseDto> dtoList = new ArrayList<>();

        for (Reserv reserv : reservList) {
            Pay pay = new Pay();
            pay.setAmount(reserv.getFinalPrice());
            pay.setMember(member);
            pay.setReserv(reserv);
            pay.setIsGroup(true);
            pay.setGroupId(groupId);

            // DTO로 변환
            PayResponseDto dto = new PayResponseDto(
                null,
                pay.getAmount(),
                reserv.getId(),
                reserv.getPlace() != null ? reserv.getPlace().getName() : null,
                reserv.getStartDate(),
                reserv.getEndDate(),
                reserv.getMemberTripPlan() != null ? reserv.getMemberTripPlan().getId() : null
            );

            dtoList.add(dto);
        }

        return dtoList;
    }
    
    @Transactional
    public void createAndVerifySingleTotalPaymentByMemberTripPlan(Long memberTripPlanId, Member member, String impUid) throws Exception {
    	System.out.println("memberTripPlanId: " + memberTripPlanId + ", memberId: " + member.getId());
    	List<Reserv> reservList = reservMapper.findByMemberTripPlanIdAndMember(memberTripPlanId, member.getId());
        if (reservList.isEmpty()) {
            throw new RuntimeException("예약이 없습니다.");
        }

        Set<Long> reservIds = reservList.stream().map(Reserv::getId).collect(Collectors.toSet());

        iamportPayService.verifyAndSaveTotalPayment(impUid, reservIds, member.getId(), memberTripPlanId);
    }
    
    /** 결제 삭제 */
    @Transactional
    public boolean softDelete(Long id) {
        // 1. 결제 조회
        Pay pay = payMapper.findById(id);
        if (pay == null) {
            throw new IllegalArgumentException("결제 내역이 없습니다: " + id);
        }

        // 2. 해당 결제에 연결된 예약들 조회
        List<Reserv> reservs = reservMapper.findAllByPayId(id);

        if (reservs == null || reservs.isEmpty()) {
            throw new IllegalStateException("결제에 연결된 예약이 없습니다.");
        }

        // 3. 모든 예약이 CANCELLED 상태인지 체크
        boolean allCancelled = reservs.stream()
        		.allMatch(r -> r.getState().equals(ReservState.CANCELLED));

        if (!allCancelled) {
            throw new IllegalStateException("모든 예약이 취소된 경우에만 결제 취소가 가능합니다.");
        }

        // 4. 결제 상태 CANCELLED 로 업데이트
        pay.setState(PayState.CANCELLED);
        int updated = payMapper.updateByState(pay);
        return updated > 0;
    }
    
    public boolean refundPayment(String impUid) throws IamportResponseException, IOException {
        // 1. 환불 요청 전에 결제정보 조회
        Pay pay = payMapper.findByImpUid(impUid);
        if (pay == null) {
            throw new RuntimeException("결제 정보가 없습니다.");
        }

        // 2. 아임포트 환불 API 호출
        boolean success = iamportPayService.cancelPayment(impUid, true);

        if (success) {
            // 3. 환불 성공 시 상태를 REFUNDED로 업데이트
            payMapper.updateStateByImpUid(impUid, PayState.REFUNDED.name());
            return true;
        }
        return false;
    }
    
}
