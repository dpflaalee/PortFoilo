package com.ssdam.tripPaw.chatting.chatroom;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.ChatRoom;


@Mapper
public interface ChatRoomMapper {
	public List<ChatRoom> findChatRoom();
	public int createChatRoom(ChatRoom chatRoom);
	public ChatRoom findRoomById(Long id);
}
