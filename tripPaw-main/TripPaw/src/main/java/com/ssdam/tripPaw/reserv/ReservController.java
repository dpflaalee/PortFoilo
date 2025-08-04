package com.ssdam.tripPaw.reserv;

import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.dto.PayResponseDto;
import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.util.JwtProvider;

import lombok.RequiredArgsConstructor;


@Controller
@RequestMapping("/reserv")
@RequiredArgsConstructor
public class ReservController {
    private final ReservService reservService;
    private final ReservMapper reservMapper;    
    private final JwtProvider jwtProvider;
    private final MemberService memberService;
    
    /** 예약 생성 */
    @PostMapping
    public ResponseEntity<Reserv> createReserv(@RequestBody Reserv reserv) {
        try {
            Reserv savedReserv = reservService.saveReserv(reserv);
            if (savedReserv != null) {
                return ResponseEntity.ok(savedReserv);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /** 단일 예약 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<Reserv> getReserv(@PathVariable Long id) {
        Reserv reserv = reservService.findById(id);
        if (reserv != null) {
            return ResponseEntity.ok(reserv);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /** 전체 예약 조회 */
    @GetMapping
    public ResponseEntity<List<Reserv>> getAllReserv(@RequestParam(required = false) Long tripPlanId,@CookieValue(value = "jwt", required = false) String token) {
        if (token == null || jwtProvider.isExpired(token)) {
            // 토큰이 없거나 만료되었으면 401 Unauthorized 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String username = jwtProvider.getUsername(token);
        Member member = memberService.findByUsername(username);
    	// 모든 예약 가져오기
        List<Reserv> reservList = reservService.findByMemberId(member.getId());

        // 예약 상태를 변경
        reservList.forEach(r -> {
            // 만료된 예약 처리
            if (r.getExpireAt() != null 
                && r.getExpireAt().isBefore(LocalDate.now()) 
                && r.getState() == ReservState.WAITING) {
                
                // 특정 트립 플랜에 속하는 예약만 처리
                if (tripPlanId == null || r.getMemberTripPlan().getTripPlan().getId().equals(tripPlanId)) {
                    r.setState(ReservState.EXPIRED);
                    reservService.updateReservState(r.getId(), ReservState.EXPIRED);
                }
            }
        });

        return ResponseEntity.ok(reservList);
    }

    @GetMapping("/membertripplan/{memberTripPlanId}")
    public ResponseEntity<List<Reserv>> getReservListByMemberTripPlan(@PathVariable Long memberTripPlanId) {
        List<Reserv> reservList = reservMapper.findByMemberTripPlanId(memberTripPlanId);
        return ResponseEntity.ok(reservList);
    }
    
    // 일괄 예약
    @PostMapping("/auto/plan")
    public ResponseEntity<?> createAutoReservations(@RequestBody Map<String, Object> body) {
    	System.out.println("[controller] body " + body);
        try {
        	Long userId = Long.valueOf(body.get("userId").toString());
        	Long memberTripPlanId = Long.valueOf(body.get("memberTripPlanId").toString());
        	Long originTripPlanId = Long.valueOf(body.get("originTripPlanId").toString());
        	List<Reserv> savedList = reservService.createReservationsFromTripPlanByUserId(userId, memberTripPlanId, originTripPlanId);
            return ResponseEntity.ok(savedList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버 오류");
        }
    }
    
    /** 예약 상태 변경 */
    @PatchMapping("/{id}/state")
    public ResponseEntity<String> updateReservState(
            @PathVariable Long id,
            @RequestParam ReservState state) {
        try {
            int result = reservService.updateReservState(id, state);
            return ResponseEntity.ok("예약 상태가 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/disabled-dates")
    public ResponseEntity<List<Map<String, String>>> getDisabledDates(@RequestParam Long placeId) {
        List<Map<String, Object>> rawRanges = reservMapper.findReservedRangesByPlace(placeId);

        List<Map<String, String>> result = rawRanges.stream()
            .map(row -> {
                Map<String, String> map = new HashMap<>();
                Object start = row.get("start_date");
                Object end = row.get("end_date");

                if (start != null && end != null) {
                    map.put("startDate", start.toString());
                    map.put("endDate", end.toString());
                }
                return map;
            })
            .filter(m -> m.containsKey("startDate") && m.containsKey("endDate"))
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // tripPlanId 예약 확인
    @GetMapping("/disabled-dates/tripPlan")
    public ResponseEntity<List<Map<String, String>>> getDisabledDatesByTripPlan(@RequestParam Long tripPlanId) {
        List<Reserv> reservList = reservMapper.findByTripPlanId(tripPlanId);

        List<Map<String, String>> result = reservList.stream()
            .filter(r -> r.getStartDate() != null && r.getEndDate() != null)
            .map(r -> {
                Map<String, String> map = new HashMap<>();
                map.put("startDate", r.getStartDate().toString());
                map.put("endDate", r.getEndDate().toString());
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /** 예약 삭제 */
    @PostMapping("/{id}/delete")
    public ResponseEntity<String> softDelete(@PathVariable Long id) {
        try {
            reservService.softDeleteReservation(id);
            return ResponseEntity.ok("예약이 삭제 처리되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("삭제 실패: " + e.getMessage());
        }
    }
    
    /** 일괄 취소 */
    @PostMapping("/batch/cancel")
    public ResponseEntity<String> cancelBatchReservations(@RequestBody List<PayResponseDto> request) {
        if (request == null || request.isEmpty()) {
            return ResponseEntity.badRequest().body("취소할 예약 목록이 비어있습니다.");
        }

        try {
            // 모든 예약에 같은 memberTripPlanId가 포함되어 있는지 확인
            Long memberTripPlanId = request.get(0).getMemberTripPlanId();
            boolean allSamePlanId = request.stream()
                    .allMatch(r -> r.getMemberTripPlanId().equals(memberTripPlanId));

            if (!allSamePlanId) {
                return ResponseEntity.badRequest().body("모든 예약의 memberTripPlanId가 같아야 합니다.");
            }

            List<Long> reservIds = request.stream()
                                          .map(PayResponseDto::getReservId)
                                          .collect(Collectors.toList());

            reservService.softGroupDelete(reservIds, memberTripPlanId);

            return ResponseEntity.ok("예약이 일괄 취소되었습니다.");
        } catch (IllegalArgumentException e) {
            // 클라이언트 요청 오류
            return ResponseEntity.badRequest().body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            // 서버 오류 로그 기록 (예: Logger 사용 권장)
            e.printStackTrace();
            return ResponseEntity.status(500).body("예약 취소 중 오류 발생: " + e.getMessage());
        }
    }
}
