package com.ssdam.tripPaw.chatting.chat;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.chatting.chatroom.ChatRoomMapper;
import com.ssdam.tripPaw.domain.Chat;
import com.ssdam.tripPaw.domain.ChatMessage;
import com.ssdam.tripPaw.domain.ChatRoom;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
	private final ChatMapper chatMapper;
	private final ChatRoomMapper chatRoomMapper;
	private final MemberMapper memberMapper;
	
	public int chatSave(Long roomId, ChatMessage chatMessage) {
		ChatRoom findChatRoom= chatRoomMapper.findRoomById(roomId);
		System.out.println("findChatRoom="+findChatRoom.getId());
		System.out.println("chatMessage="+chatMessage.getSender());
		
		Member findMember = memberMapper.findByUsername(chatMessage.getSender());
		Chat chat = Chat.builder()	
						.content(chatMessage.getContent())
						.contentType("chat")
						.chatRoom(findChatRoom)
						.sender(findMember)
						.sentAt(LocalDateTime.now())
						.build();
		return chatMapper.chatSave(chat);
	}
	
}
