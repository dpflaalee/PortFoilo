package com.ssdam.tripPaw.pay;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Pay;
import com.ssdam.tripPaw.domain.PayShare;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.reserv.ReservMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pay/share")
public class PayShareController {

    private final PayShareService payShareService;
    private final MemberService memberService;
    private final PayService payService;
    private final ReservMapper reservMapper;

    // 특정 결제의 더치페이 항목 전체 조회
    @GetMapping("/pay/{payId}")
    public PayShare getById(@PathVariable Long payId) {
        return payShareService.findById(payId);
    }
    
    @GetMapping("/my-share/{reservId}")
    public ResponseEntity<?> getMyPayShare(@PathVariable Long reservId,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        Member member = memberService.findByUsername(userDetails.getUsername());
        PayShare payShare = payShareService.findByReservIdAndMember(reservId, member);
        if (payShare == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payShare);
    }
    
    @GetMapping("/dutch/participants/{reservId}")
    public ResponseEntity<Map<String, Object>> getParticipants(@PathVariable Long reservId) {
        // 예약 정보 가져오기
        Reserv reserv = reservMapper.findById(reservId);

        // 예약 인원 수 (countPeople)
        int totalParticipants = reserv != null ? reserv.getCountPeople() : 0;

        // 참가자 목록 가져오기
        List<Member> participants = payShareService.getParticipantsByReservId(reservId);

        // 응답 데이터로 참가자 목록과 예약 인원 수 반환
        Map<String, Object> response = new HashMap<>();
        response.put("participants", participants);
        response.put("totalParticipants", totalParticipants);

        return ResponseEntity.ok(response);
    }
    
    // 더치페이
    @PostMapping("/dutch/create/{reservId}")
    public ResponseEntity<?> createDutchPay(@PathVariable Long reservId,
                                            @RequestBody List<Long> participantIds,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        Member owner = memberService.findByUsername(userDetails.getUsername());
        List<Member> participants = memberService.findAllByIds(participantIds);
        Pay pay = payShareService.createDutchPay(reservId, owner, participants);
        return ResponseEntity.ok(pay);
    }
    
    @PostMapping("/dutch/join/{reservId}")
    public ResponseEntity<?> joinDutchPay(@PathVariable Long reservId,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Member member = memberService.findByUsername(userDetails.getUsername());
        payShareService.joinDutchPay(reservId, member);
        return ResponseEntity.ok("참여 완료");
    }
    
    @PostMapping("/dutch/pay/{payShareId}")
    public ResponseEntity<?> completeDutchPay(@PathVariable Long payShareId,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        Member member = memberService.findByUsername(userDetails.getUsername());
        payShareService.completePayShare(payShareId, member);
        return ResponseEntity.ok("결제 완료");
    }
}
