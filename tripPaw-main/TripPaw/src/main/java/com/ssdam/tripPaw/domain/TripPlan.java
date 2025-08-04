package com.ssdam.tripPaw.domain;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

@Getter
@Setter
@Entity
@NoArgsConstructor

public class TripPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String title;

    private int days;

    @Column(name = "is_public")
    private boolean publicVisible;
    
    private LocalDateTime createdAt;

    private String imageUrl;

    @OneToMany(mappedBy = "tripPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripPlanCourse> tripPlanCourses;
    
    // 테이블 영향 x
    @Transient
    private Double avgRating;

    @Transient
    private Long reviewCount;
    
    @Transient
    private List<Review> reviews;
}
