package com.ssdam.tripPaw.chatting.chatroom;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.ChatRoom;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
	@Autowired
	private ChatRoomMapper chatRoomMapper;
	
	public ChatRoom createChatRoom(ChatRoom chatRoom) {
		chatRoomMapper.createChatRoom(chatRoom);
		return chatRoom;
	}
	
	public List<ChatRoom> chatRoomList(){
		return chatRoomMapper.findChatRoom();
	}
	
	public ChatRoom findRoomById(Long id) {
		System.out.println("findRoomById실행="+id);
		return chatRoomMapper.findRoomById(id);
	}
}
