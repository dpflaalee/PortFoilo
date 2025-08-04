package com.ssdam.tripPaw.chatting.chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.ssdam.tripPaw.chatting.chatRoomMember.ChatRoomMemberService;
import com.ssdam.tripPaw.chatting.chatRoomMember.ChatRoomMemberStatus;
import com.ssdam.tripPaw.chatting.chatroom.ChatRoomService;
import com.ssdam.tripPaw.domain.ChatMessage;
import com.ssdam.tripPaw.domain.ChatRoom;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.config.ChatRole;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
	
	private final SimpMessagingTemplate messagingTemplate;
	private final ChatService chatService;
	private final ChatRoomMemberService chatRoomMemberService;
	private final MemberService memberService;
	private final ChatRoomService chatRoomService;
	
	@GetMapping("/chat")
	public String chat() {
		return "chat";
	}

	@MessageMapping("/chat/{roomId}/sendMessage")
    	public void sendMessage(@DestinationVariable Long roomId,@Payload ChatMessage chatMessage) {
	    	System.out.println("chat="+chatMessage.getContent());
	    	System.out.println("sender="+chatMessage.getSender());
	    	System.out.println("roomid="+chatMessage.getRoomId());
	    	chatService.chatSave(roomId, chatMessage);
	    	messagingTemplate.convertAndSend("/topic/chat/" + roomId, chatMessage);
    	}

	@MessageMapping("/chat/{roomId}/addUser")
	public void addUser(@DestinationVariable String roomId,@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        	// WebSocket 세션에 사용자 이름 저장 (나중에 사용자 연결 해제 시 유용)
		String type = chatMessage.getType().name();
		System.out.println("type = "+chatMessage.getType().name());
		System.out.println("roomId = "+roomId);
		try {
			Member member = memberService.findByUsername(chatMessage.getSender());
			ChatRoom chatRoom = chatRoomService.findRoomById(Long.parseLong(roomId));
			
			if(type.equals("JOIN")) {
				chatRoomMemberService.insertChatRoomMember(member, chatRoom, ChatRole.MEMBER,ChatRoomMemberStatus.ACTIVE);
			}else if(type.equals("LEAVE")) {
				chatRoomMemberService.updateChatRoomMember(member, chatRoom, ChatRole.MEMBER,ChatRoomMemberStatus.LEAVE);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}
		
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        
        messagingTemplate.convertAndSend("/topic/chat/"+roomId,chatMessage);
    }
	
	
}
