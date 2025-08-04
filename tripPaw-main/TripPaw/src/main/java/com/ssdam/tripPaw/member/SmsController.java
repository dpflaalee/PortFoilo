package com.ssdam.tripPaw.member;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.member.util.SmsCertificationUtil;

@RestController
@RequestMapping("/api/sms")
public class SmsController {
	
	@Autowired
	private SmsCertificationUtil coolSmsService;
	
	@PostMapping("/send/{phoneNum}")
	public ResponseEntity<?> sendSms(@PathVariable String phoneNum) {
		String phoneNumber = phoneNum;
		try {
			String getVerificationCode = coolSmsService.sendSMS(phoneNumber);
			 return ResponseEntity.ok(Map.of("code", getVerificationCode));
        } catch (Exception e) {
            e.printStackTrace();
            return (ResponseEntity<?>) ResponseEntity.notFound();
        }
	}
}
