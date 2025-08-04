package com.ssdam.tripPaw.chatting.chatRoomMember;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.ChatRoomMember;

@Mapper
public interface ChatRoomMemberMapper {
	public int insertChatRoomMember(ChatRoomMember chatRoomMember);
	public int updateChatRoomMember(ChatRoomMember chatRoomMember);
}
