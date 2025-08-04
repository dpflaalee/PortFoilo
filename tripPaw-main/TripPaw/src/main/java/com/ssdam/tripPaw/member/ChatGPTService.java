package com.ssdam.tripPaw.member;

import java.util.Arrays;
import java.util.Collections;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatGPTService {

	private final RestTemplate restTemplate;
	@Value("${openai.api.key}")
	private String apiKey;
	
	public ResponseEntity<String> chat(String message){
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
		headers.set("Authorization", "Bearer "+apiKey);
		
		JSONObject messageSystem = new JSONObject();
		messageSystem.put("role", "system");
		messageSystem.put("content", "");
		
		JSONObject messageUser = new JSONObject();
		messageUser.put("role", "user");
		messageUser.put("content", "동물과 관련된 영어 닉네임 5개만 추천해줘 닉네임만 대답해줘 단, 단어 앞에 번호는 제외해줘");
		
		JSONObject requestBody = new JSONObject();
		requestBody.put("model", "gpt-4.1-nano");
		requestBody.put("messages", new JSONArray(Arrays.asList(messageSystem, messageUser)));
		
		HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
		
		String apiEndpoint = "https://api.openai.com/v1/chat/completions";
		try {
			
			ResponseEntity<String> response = restTemplate.postForEntity(apiEndpoint, request, String.class);
			
			if(response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
				System.out.println("GPT요청 성공!");
				System.out.println(response);
				return response;
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("api 호출 중 오류 발생!");
			}
		
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("api 호출 중 예외 발생: ");
		}
	}
}
