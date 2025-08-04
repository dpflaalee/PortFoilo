package com.ssdam.tripPaw.member;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatGPTApiController {
	private final ChatGPTService chatGPTService;
	
	@GetMapping("/api/chatGPT")
	public ResponseEntity<String> chatGPT(){
		String message = "";
		return chatGPTService.chat(message);
	}
	
}
