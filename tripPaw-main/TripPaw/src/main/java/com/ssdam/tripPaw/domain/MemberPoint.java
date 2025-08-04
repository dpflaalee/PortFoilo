package com.ssdam.tripPaw.domain;

import javax.persistence.*;

import lombok.Data;

@Entity
@Table(name = "member_point")
@Data
public class MemberPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동증가
    private Long id;  // 새로 추가한 PK 컬럼

    @Column(name = "member_id", nullable = false)
    private Long memberId;  // FK용

    @Column(nullable = false)
    private Integer point;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

}
