package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.dto.TripPlanCoursePlaceDto;
import com.ssdam.tripPaw.place.PlaceMapper;
import com.ssdam.tripPaw.tripPlan.TripPlanMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequestMapping("/reserv")
@RequiredArgsConstructor
public class ReservService {
    private final ReservMapper reservMapper;
    private final PlaceMapper placeMapper;
    private final TripPlanMapper tripPlanMapper;

    /** 예약 생성 */
    @Transactional
    public Reserv saveReserv(Reserv reserv) {
        reserv.setCreatedAt(LocalDateTime.now());

        if (reserv.getExpireAt() == null) {
            reserv.setExpireAt(LocalDate.now().plusDays(5));
        }

        // 중복 예약 체크
        boolean exists = reservMapper.existsOverlappingReservation(
            reserv.getMember().getId(),
            reserv.getPlace().getId(),
            reserv.getStartDate(),
            reserv.getEndDate()
        );
        if (exists) {
            throw new IllegalStateException("해당 기간에 이미 예약이 존재합니다.");
        }

        int result = reservMapper.insert(reserv);
        if (result > 0) {
            // insert 후 예약 객체에 생성된 id가 들어있어야 함 (MyBatis에 따라 다름)
            return reserv;
        } else {
            return null;
        }
    }

    /** 예약 조회 */
    public Reserv findById(Long id) {
    	Reserv reserv = reservMapper.findByIdWithPlace(id);
        if (reserv == null || reserv.getDeleteAt() != null) {
            throw new IllegalArgumentException("존재하지 않거나 삭제된 예약입니다.");
        }
        return reserv;
    }

    /** 예약 전체 조회 */
    public List<Reserv> findAll() {
        return reservMapper.findAll();
    }

    public List<Reserv> findByMemberId(Long memberId) {
        return reservMapper.findByMemberId(memberId);
    }
    
    public List<Reserv> findByTripPlansId(Long tripPlanId) {
        return reservMapper.findByTripPlansId(tripPlanId);  // MyBatis 매퍼 호출
    }
    
    public List<Reserv> findByMemberTripPlanIdAndMember(Long memberTripPlanId, Long memberId) {
        return reservMapper.findByMemberTripPlanIdAndMember(memberTripPlanId, memberId);
    }
    
    public MemberTripPlan findMemberTripPlanById(Long id) {
        return reservMapper.findMemberTripPlanById(id);
    }
    
    @Transactional
    public List<Reserv> createReservationsFromTripPlanByUserId(Long userId, Long memberTripPlanId, Long originTripPlanId) {
        Member member = reservMapper.findMemberById(userId);
        if (member == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        // 사용자의 여행 코스 목록 조회
        List<TripPlanCoursePlaceDto> courseList = reservMapper.findCoursesByMemberTripPlanId(memberTripPlanId);

        List<Reserv> savedList = new ArrayList<>();
        LocalDate baseDate = LocalDate.now();

        for (int i = 0; i < courseList.size(); i++) {
            TripPlanCoursePlaceDto dto = courseList.get(i);

            // 장소와 여행 계획 정보 조회
            Place place = placeMapper.findById(dto.getPlaceId());
            MemberTripPlan memberTripPlan = reservMapper.findMemberTripPlanById(dto.getMemberTripPlanId());
            
            // 장소나 여행 계획이 없으면 건너뜀
            if (place == null || memberTripPlan == null) continue;

            // DTO에 여행 계획 정보 설정 (여기서 memberTripPlan을 가져와서 설정)
            dto.setStartDate(memberTripPlan.getStartDate());
            dto.setEndDate(memberTripPlan.getEndDate());
            dto.setCountPeople(memberTripPlan.getCountPeople());
            dto.setCountPet(memberTripPlan.getCountPet());
            dto.setOriginTripPlanId(originTripPlanId);
            TripPlan tripPlan = tripPlanMapper.findById(dto.getOriginTripPlanId());
            if (tripPlan == null) {
                System.out.println("TripPlan을 찾을 수 없음: " + dto.getOriginTripPlanId());
            }

            // 예약 객체 생성
            Reserv reserv = dto.toReserv(member, place, reservMapper, tripPlanMapper);
            System.out.println("Reserv에 세팅된 TripPlan ID: " + 
            	    (reserv.getTripPlan() != null ? reserv.getTripPlan().getId() : "null"));
            
            // 예약이 겹치는지 확인
            if (!reservMapper.existsOverlappingReservation(
                    member.getId(), place.getId(), reserv.getStartDate(), reserv.getEndDate())) {

            	System.out.println("Inserting Reserv: " + reserv);
            	int result = reservMapper.insert(reserv);
            	System.out.println("Insert Result: " + result);

            	if (result > 0) {
            	    savedList.add(reserv);
            	}
            }
        }

        return savedList;
    }
    
    /** 예약 상태 업데이트 */
    @Transactional
    public int updateReservState(Long reservId, ReservState newState) {
        Reserv reserv = reservMapper.findById(reservId);
        if (reserv == null) {
            throw new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservId);
        }

        reserv.setState(newState);
        return reservMapper.updateByState(reserv);
    }
    
    /** 예약 삭제 */
    @Transactional
    public int softDeleteReservation(Long id) {
        Reserv reserv = reservMapper.findById(id);
        if (reserv == null || reserv.getDeleteAt() != null) {
            throw new IllegalArgumentException("존재하지 않거나 이미 삭제된 예약입니다.");
        }

        return reservMapper.softDelete(id);
    }
    
    /** 일괄 취소 */
    @Transactional
    public void softGroupDelete(List<Long> reservIds, Long memberTripPlanId) {
        Logger logger = LoggerFactory.getLogger(this.getClass());

        if (reservIds == null || reservIds.isEmpty()) {
            throw new IllegalArgumentException("취소할 예약 ID 목록이 비어있습니다.");
        }
        if (memberTripPlanId == null) {
            throw new IllegalArgumentException("memberTripPlanId는 필수값입니다.");
        }

        try {
            int rowsAffected = reservMapper.softGroupDelete(reservIds, memberTripPlanId);

            if (rowsAffected <= 0) {
                throw new RuntimeException("예약 취소 실패: 영향을 미친 예약이 없습니다.");
            }

            logger.info("예약 취소 완료: 취소된 예약 건수 = {}", rowsAffected);
        } catch (Exception e) {
            logger.error("예약 취소 처리 중 오류 발생", e);
            throw new RuntimeException("예약 취소 처리 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
