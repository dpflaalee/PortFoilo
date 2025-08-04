package com.ssdam.tripPaw.payapi;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.Reserv;

import com.ssdam.tripPaw.pay.PayMapper;
import com.ssdam.tripPaw.pay.PayState;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservService;
import com.ssdam.tripPaw.reserv.ReservState;

import lombok.RequiredArgsConstructor;
import com.siot.IamportRestClient.request.CancelData;

@Service
@RequiredArgsConstructor
public class IamportPayService {
	
	private final ReservService reservService;
	
    @Value("${iamport.api.key}")
    private String apiKey;

    @Value("${iamport.api.secret}")
    private String apiSecret;

    private IamportClient iamportClient;

    @Autowired private PayMapper payMapper;
    @Autowired private ReservMapper reservMapper;

    @PostConstruct
    public void init() {
        this.iamportClient = new IamportClient(apiKey, apiSecret);
    }

    /** 결제 검증 후 DB 저장 */
    public int verifyAndSavePayment(String impUid, Long reservId, Long memberId) throws IamportResponseException, IOException {
        IamportResponse<Payment> response = iamportClient.paymentByImpUid(impUid);
        Payment payment = response.getResponse();

        // 실제 결제 금액과 예약 확인 등 검증 추가 가능

        // DB 저장
        Pay pay = new Pay();
        pay.setImpUid(payment.getImpUid());
        pay.setMerchantUid(payment.getMerchantUid());
        pay.setAmount(payment.getAmount().intValue());
        pay.setPayMethod(payment.getPayMethod());
        pay.setPgProvider(payment.getPgProvider());
        pay.setPaidAt(payment.getPaidAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        pay.setCreatedAt(LocalDateTime.now());
        pay.setState(PayState.PAID);

        // 예약/유저 연동
        Reserv reserv = reservMapper.findById(reservId);
        pay.setReserv(reserv);

        Member member = Member.builder().id(memberId).build(); // 최소한 ID만 설정
        pay.setMember(member);

        int result = payMapper.insert(pay);
        
        if (result > 0) {
            reservMapper.updatePayIdByReservId(pay.getId(), reservId);
            reservService.updateReservState(reservId, ReservState.CONFIRMED);
        }
        
        return result;
    }
    
    @Transactional
    public int verifyAndSaveTotalPayment(String impUid, Set<Long> reservIds, Long memberId, Long memberTripPlanId) throws IamportResponseException, IOException {
        // 1. 아임포트 결제 검증
    	IamportResponse<Payment> response = iamportClient.paymentByImpUid(impUid);
    	Payment payment = response.getResponse();

    	System.out.println("아임포트 결제금액: " + payment.getAmount());

    	int totalReservedAmount = reservIds.stream()
    	    .mapToInt(id -> {
    	        Reserv r = reservMapper.findById(id);
    	        int finalPrice = r.getFinalPrice() == 0 ? 10000 : r.getFinalPrice();
    	        System.out.println("예약 ID: " + id + ", finalPrice: " + r.getFinalPrice());
    	        return finalPrice;
    	    })
    	    .sum();

    	System.out.println("예약 총 합계 금액: " + totalReservedAmount);

    	if (payment.getAmount().intValue() != totalReservedAmount) {
    	    throw new IllegalArgumentException("결제 금액과 예약 합계 금액이 다릅니다.");
    	}

        // 4. 이미 저장된 impUid 체크
        if (payMapper.findByImpUid(impUid) != null) {
            throw new IllegalArgumentException("이미 저장된 imp_uid 입니다.");
        }

        // 5. 총합 결제 Pay 저장
        Pay pay = new Pay();
        pay.setImpUid(payment.getImpUid());
        pay.setMerchantUid(payment.getMerchantUid());
        pay.setAmount(payment.getAmount().intValue());
        pay.setIsGroup(true);
        pay.setGroupId(memberTripPlanId);
        pay.setPayMethod(payment.getPayMethod());
        pay.setPgProvider(payment.getPgProvider());
        pay.setPaidAt(payment.getPaidAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        pay.setCreatedAt(LocalDateTime.now());
        pay.setState(PayState.PAID);
        pay.setHaspayShare(false);

        Member member = Member.builder().id(memberId).build();
        pay.setMember(member);

        int insertResult = payMapper.insert(pay);
        if (insertResult <= 0) {
            throw new RuntimeException("결제 정보 저장 실패");
        }

        // 6. 예약별로 결제(pay) 연결 및 상태 변경
        for (Long reservId : reservIds) {
            Reserv reserv = reservMapper.findById(reservId);
            if (reserv.getFinalPrice() == 0) {
                reserv.setFinalPrice(10000);
            }
            reserv.setPay(pay);  // 예약에 총합 결제 pay 연결
            reserv.setState(ReservState.CONFIRMED);
            reservMapper.updateWithPay(reserv);
        }

        return insertResult;
    }	
    
    public boolean cancelPayment(String impUid, boolean isFullCancel) {
        try {
            // 전체 취소
            CancelData cancelData = new CancelData(impUid, true);

            // 환불 실행
            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            Payment cancelledPayment = cancelResponse.getResponse();

            System.out.println("환불 상태: " + cancelledPayment.getStatus());

            if (cancelledPayment != null && "cancelled".equalsIgnoreCase(cancelledPayment.getStatus())) {
                Pay pay = payMapper.findByImpUid(impUid);
                if (pay == null) {
                    throw new RuntimeException("해당 결제 정보가 존재하지 않습니다.");
                }

                pay.setState(PayState.REFUNDED);
                payMapper.updateByState(pay);

                Reserv reserv = null;
                if (pay.getReserv() != null) {
                    reserv = reservMapper.findById(pay.getReserv().getId());
                    if (reserv == null) {
                        throw new RuntimeException("예약 정보를 찾을 수 없습니다.");
                    }
                    reserv.setState(ReservState.CANCELLED);
                    reservMapper.updateByState(reserv);
                }

                return true;
            }

            return false;
        } catch (IamportResponseException | IOException e) {
            e.printStackTrace();  // 로그 출력
            throw new RuntimeException("아임포트 환불 처리 중 오류 발생: " + e.getMessage());
        }
    }
    
}