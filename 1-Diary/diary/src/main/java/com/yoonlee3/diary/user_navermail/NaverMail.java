package com.yoonlee3.diary.user_navermail;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Component;


@Component
public class NaverMail {

    public void sendMail(String subject , String content, String toEmail) {
        String host = "smtp.naver.com";
        String user = "yourId@naver.com"; // 네이버 ID
        String password = "yourPass";      // 비밀번호

        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.naver.com");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user, password);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(user));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject(subject);
            message.setContent(
                "<div style='background-color:aliceblue; padding:15px; border-radius:10px;'>"
              + "<h3>비밀번호 재설정 안내</h3>"
              + "<p>" + content + "</p>"
              + "</div>", 
              "text/html; charset=UTF-8");

            Transport.send(message);
            System.out.println("이메일 전송 성공");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
