package com.ssdam.tripPaw.chatting.chatRoomMember;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.ChatRoom;
import com.ssdam.tripPaw.domain.ChatRoomMember;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.ChatRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomMemberService {
	private final ChatRoomMemberMapper chatRoomMemberMapper;
	
	public int insertChatRoomMember(Member member, ChatRoom chatRoom, ChatRole role, ChatRoomMemberStatus status) {
		ChatRoomMember chatRoomMember;
		if(role.name().equals("JOIN")) {
			chatRoomMember = ChatRoomMember.create(member, chatRoom, role, status);
		}else {
			chatRoomMember = ChatRoomMember.create(member, chatRoom, role, status);
		}
		return chatRoomMemberMapper.insertChatRoomMember(chatRoomMember); 
	}
	
	public int updateChatRoomMember(Member member, ChatRoom chatRoom, ChatRole role, ChatRoomMemberStatus status) {
		ChatRoomMember chatRoomMember = ChatRoomMember.create(member, chatRoom, role, status);
		return chatRoomMemberMapper.updateChatRoomMember(chatRoomMember);
	}
	
}
