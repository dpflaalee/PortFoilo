package com.ssdam.tripPaw.domain;
//유저 루틴

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class CheckRoutine {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String title;
	
	@Column(name = "is_saved")
	private Boolean isSaved;
	
	private LocalDateTime createdAt = LocalDateTime.now();
	
	//유저아이디 연결
	@ManyToOne @JoinColumn(name="member_id")
	private Member member;
	
	//memberTripPlan 아이디 연결
	@ManyToOne
    	@JoinColumn(name = "member_trip_plan_id") 
    	private MemberTripPlan memberTripPlan;
	
	//membercheck
	@OneToMany(mappedBy = "checkRoutine", cascade = CascadeType.ALL)
	private List<MemberCheck> memberChecks = new ArrayList<>();
	
	//memberId
	public void setMemberId(Long memberId) {
        if (this.member == null) {
            this.member = new Member();   }
        this.member.setId(memberId);
    }

    	// memberTripPlan
	public void setMemberTripPlanId(Long memberTripPlanId) {
        if (this.memberTripPlan == null) {
            this.memberTripPlan = new MemberTripPlan();
        }
        this.memberTripPlan.setId(memberTripPlanId);
    }


    // isSaved 
    public void setIsSaved(boolean isSaved) { this.isSaved = isSaved; }
}
