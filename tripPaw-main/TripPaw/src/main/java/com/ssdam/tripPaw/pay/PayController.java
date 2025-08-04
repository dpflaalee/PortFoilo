package com.ssdam.tripPaw.pay;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.dto.PayResponseDto;
import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.payapi.IamportPayService;
import com.ssdam.tripPaw.reserv.ReservService;
import com.ssdam.tripPaw.reserv.ReservState;

@RestController
@RequestMapping("/pay")
public class PayController {
    @Autowired private IamportPayService iamportPayService;
    @Autowired private PayService payService;
    @Autowired private MemberService memberService;
    @Autowired private ReservService reservService;
    @Autowired private JwtProvider jwtProvider;

    @GetMapping("")
    public ResponseEntity<?> getAllPayments() {
        try {
            var payList = payService.findAll();
            return ResponseEntity.ok(payList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("결제 내역 조회 실패: " + e.getMessage());
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
        @RequestParam String impUid,
        @RequestParam Long reservId,
        @RequestParam Long memberId
    ) {
        try {
            int result = iamportPayService.verifyAndSavePayment(impUid, reservId, memberId);
            return ResponseEntity.ok("결제 검증 및 예약 확정 완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("결제 검증 실패: " + e.getMessage());
        }
    }
    
    /** 결제 내역 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable Long id) {
        var pay = payService.findById(id);
        if (pay == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pay);
    }
    
    @GetMapping("/batch/{memberTripPlanId}")
    public ResponseEntity<?> getBatchPayInfo(
        @PathVariable Long memberTripPlanId,
        @RequestParam Long userId
    ) {
        Member member = memberService.findById(userId);

        if (member == null) {
            return ResponseEntity.badRequest().body("해당 사용자를 찾을 수 없습니다.");
        }

        try {
            List<PayResponseDto> payList = payService.createBatchPayDtosByMemberTripPlan(memberTripPlanId, member);

            // 💡 amount가 0이면 10000으로 설정
            for (PayResponseDto dto : payList) {
                if (dto.getAmount() == 0) {
                    dto.setAmount(10000);
                }
            }

            int totalAmount = payList.stream().mapToInt(PayResponseDto::getAmount).sum();

            if (payList.isEmpty()) {
                List<Reserv> reservList = reservService.findByMemberTripPlanIdAndMember(memberTripPlanId, userId);
                int reservTotalAmount = reservList.stream()
                    .mapToInt(Reserv::getFinalPrice)
                    .sum();

                return ResponseEntity.ok(Map.of(
                    "totalAmount", reservTotalAmount,
                    "reservList", reservList
                ));
            }

            return ResponseEntity.ok(Map.of(
                "totalAmount", totalAmount,
                "payList", payList
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("일괄 결제 내역 생성 실패: " + e.getMessage());
        }
    }
    
    @PostMapping("/batch/{memberTripPlanId}/verify")
    public ResponseEntity<?> createAndVerifyTotalPayment(
        @PathVariable Long memberTripPlanId,
        @RequestBody Map<String, String> body, // impUid만 받음
        @CookieValue(value = "jwt", required = false) String token
    ) {
        if (token == null || jwtProvider.isExpired(token)) {
            // 토큰이 없거나 만료되었으면 401 Unauthorized 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String username = jwtProvider.getUsername(token);
        Member member = memberService.findByUsername(username);

        try {
            String impUid = body.get("impUid");
            if (impUid == null || impUid.isEmpty()) {
                throw new IllegalArgumentException("imp_uid가 없습니다.");
            }

            System.out.println("impUid = " + impUid);

            payService.createAndVerifySingleTotalPaymentByMemberTripPlan(memberTripPlanId, member, impUid);
            System.out.println("createAndVerifySingleTotalPayment 성공");

            return ResponseEntity.ok("총합 결제 저장 및 예약 상태 업데이트 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("결제 처리 중 오류: " + e.getMessage());
        }
    }
    
//    // 더미 테스트
//    @PostMapping("/dummy")
//    public ResponseEntity<?> createDummyTripPlanForTest(
//        @RequestParam(defaultValue = "1") Long memberId // 기본 더미 유저 ID: 1
//    ) {
//        Member member = memberService.findById(memberId);
//        if (member == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 ID의 더미 유저가 없습니다.");
//        }
//
//        try {
//            Long tripPlanId = payService.createDummyTripPlanWithReservs(member);
//            return ResponseEntity.ok(Map.of("tripPlanId", tripPlanId));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("더미 생성 실패: " + e.getMessage());
//        }
//    }
    
    /** 결제 취소(환불) 처리 */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPayment(@PathVariable Long id) {
        try {
            payService.softDelete(id);
            return ResponseEntity.ok("결제 취소 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }
    
    @GetMapping("/reserv/{reservId}")
    public ResponseEntity<?> getPayByReservId(@PathVariable Long reservId) {
        Pay pay = payService.findByReservId(reservId);
        if (pay == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pay);
    }
    
    @PostMapping("/{impUid}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable String impUid) {
        try {
            Pay pay = payService.findByImpUid(impUid);
            if (pay == null) {
                return ResponseEntity.notFound().build();
            }
        	
            boolean result = payService.refundPayment(impUid);
            if (result) {
                return ResponseEntity.ok("환불이 성공적으로 처리되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("환불 처리 실패");
            }
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }

    
}
