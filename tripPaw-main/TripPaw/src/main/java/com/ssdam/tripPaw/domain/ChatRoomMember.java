package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ssdam.tripPaw.chatting.chatRoomMember.ChatRoomMemberStatus;
import com.ssdam.tripPaw.member.config.ChatRole;

import lombok.Data;

@Entity
@Table(name = "ChatRoomMember")
@Data
public class ChatRoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatroom_member_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id") // DB에 생성될 외래키 컬럼명
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id") // DB에 생성될 외래키 컬럼명
    private ChatRoom chatRoom;

    
    @Enumerated(EnumType.STRING) // Enum 타입을 DB에 저장할 때 문자열로 저장
    private ChatRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatRoomMemberStatus status; // 상태 컬럼 추가
    // 추가 컬럼 2: 참여 시각
    private LocalDateTime joinedAt;
    	
    //== 생성 메서드 ==//
    public static ChatRoomMember create(Member member, ChatRoom chatRoom, ChatRole role, ChatRoomMemberStatus status) {
        ChatRoomMember chatRoomMember = new ChatRoomMember();
        chatRoomMember.setMember(member);
        chatRoomMember.setChatRoom(chatRoom);
        chatRoomMember.setRole(role);
        chatRoomMember.setStatus(status);
        chatRoomMember.setJoinedAt(LocalDateTime.now());
        return chatRoomMember;
    }
    
}
