package com.ssdam.tripPaw.member.util;

import java.util.Random;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;


@Service
public class SmsCertificationUtil {
	
	@Value("${coolsms.apikey}")
	private String apiKey;
	@Value("${coolsms.apisecret}")
	private String apiSecret;
	@Value("${coolsms.fromnumber}")
	private String fromNumber;
	
	DefaultMessageService messageService;
	
	@PostConstruct // 의존성 주입이 완료된 후 초기화를 수행하는 메서드
	public void init() {
		this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
	}
	
	public String sendSMS(String to) {
		String random = getRandomNumber();
		
		Message message = new Message();
		message.setFrom(fromNumber);
		message.setTo(to);
		message.setText("본인확인 인증번호는 " + random + "입니다.");

		return random;
	}
	
	public String getRandomNumber() {
		Random rand = new Random();
        StringBuilder numStr = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            numStr.append(rand.nextInt(10));
        }
        return numStr.toString();
	}
}
