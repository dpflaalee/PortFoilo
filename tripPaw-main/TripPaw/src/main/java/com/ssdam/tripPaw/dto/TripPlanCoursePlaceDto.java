package com.ssdam.tripPaw.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.reserv.ReservMapper;
import com.ssdam.tripPaw.reserv.ReservState;
import com.ssdam.tripPaw.tripPlan.TripPlanMapper;

import lombok.Data;

@Data
public class TripPlanCoursePlaceDto {
    private Long memberTripPlanId;
    private Long tripPlanId;
    private Long originTripPlanId;
    private Long placeId;
    private String placeName;
    private Double latitude;
    private Double longitude;

    private LocalDate startDate;
    private LocalDate endDate;
    private int countPeople;
    private int countPet;
    private int day;

    public Reserv toReserv(Member member, Place place, ReservMapper reservMapper, TripPlanMapper tripPlanMapper) {
        
        // memberTripPlanId를 통해 실제 MemberTripPlan을 조회
        MemberTripPlan memberTripPlan = reservMapper.findMemberTripPlanById(this.memberTripPlanId);
        TripPlan tripPlan = tripPlanMapper.findById(this.originTripPlanId);
        
        if (memberTripPlan == null) {
        	System.out.println("No MemberTripPlan found for ID: " + this.memberTripPlanId);
            return null; // memberTripPlan이 없으면 null 반환
        }

        // Reserv 객체에 데이터를 설정
        Reserv reserv = new Reserv();
        reserv.setStartDate(this.startDate != null ? this.startDate : memberTripPlan.getStartDate());
        reserv.setEndDate(this.endDate != null ? this.endDate : memberTripPlan.getEndDate());
        reserv.setState(ReservState.WAITING);
        reserv.setCountPeople(this.countPeople != 0 ? this.countPeople : memberTripPlan.getCountPeople());
        reserv.setCountPet(this.countPet != 0 ? this.countPet : memberTripPlan.getCountPet());
        reserv.setMember(member);
        reserv.setPlace(place);
        reserv.setMemberTripPlan(memberTripPlan);
        reserv.setCreatedAt(LocalDateTime.now());
        reserv.setTripPlan(tripPlan != null ? tripPlan : memberTripPlan.getTripPlan());
        

        return reserv;
    }
}
