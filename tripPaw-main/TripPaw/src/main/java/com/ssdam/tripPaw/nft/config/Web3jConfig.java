package com.ssdam.tripPaw.nft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

@Configuration
public class Web3jConfig {
	
    @Bean
    public Web3j web3j() {
        // 네트워크 주소는 Kairos or Sepolia 등 상황에 맞게 설정
        return Web3j.build(new HttpService("https://sepolia.infura.io/v3/a8645a85a62847febc286371203ae4b3"));
    }
    
    
}