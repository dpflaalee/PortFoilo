package com.ssdam.tripPaw.chatting.chatroom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.ssdam.tripPaw.domain.ChatRoom;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatRoomRepository {
	private Map<String, ChatRoom> chatRoomMap;
	private ChatRoomService chatRoomService;
	
	   public List<ChatRoom> findAllRoom() {
	        // 채팅방 생성 순서 최신 순으로 반환
	        List<ChatRoom> chatRooms = chatRoomService.chatRoomList();
	        System.out.println("chatRooms="+chatRooms);
	        Collections.reverse(chatRooms);
	        return chatRooms;
	    }

}

