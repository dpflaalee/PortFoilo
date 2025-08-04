package com.ssdam.tripPaw.review;

import java.io.StringReader;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

@Service
public class WeatherService {

    @Value("${kma.api.key}")
    private String serviceKey;

    private static final String KMA_API = "https://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList";

    public String getWeather(LocalDate date, double lat, double lon) {
        try {
        	//1. 파라미터 확인
        	System.out.println("[DEBUG] 날씨 호출 - date: " + date + ", lat: " + lat + ", lon: " + lon);

            int stationId = getNearestStation(lat, lon);
            
         //2. 지점코드 확인
            System.out.println("[DEBUG] stationId: " + stationId);
            
            if (stationId == -1) {
                return "알 수 없음";
            }

            String formattedDate = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            String url = KMA_API + "?"
                    + "serviceKey=" + serviceKey
                    + "&dataType=XML"
                    + "&dataCd=ASOS"
                    + "&dateCd=HR"
                    + "&startDt=" + formattedDate
                    + "&startHh=06"
                    + "&endDt=" + formattedDate
                    + "&endHh=06"
                    + "&stnIds=" + stationId
                    + "&numOfRows=1&pageNo=1";

            //3. 실제 호출 URL 확인
            System.out.println("[DEBUG] 호출 URL: " + url);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(new URI(url), String.class);

            //4. API 응답 원문 확인
            System.out.println("[DEBUG] XML 응답: " + response.getBody());

            try (StringReader reader = new StringReader(response.getBody())) {
                InputSource inputSource = new InputSource(reader);
                Document doc = DocumentBuilderFactory.newInstance()
                        .newDocumentBuilder()
                        .parse(inputSource);

                NodeList items = doc.getElementsByTagName("item");
                if (items.getLength() > 0) {
                    Node item = items.item(0);
                    return parseWeatherCondition(item);
                } else {
                    return "알 수 없음";
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "알 수 없음" + e.getMessage();
        }
    }

    private String parseWeatherCondition(Node item) {
        String rnStr = getTagValue("rn", item);        // 강수량
        String dsnwStr = getTagValue("dsnw", item);    // 적설량
        String cloudStr = getTagValue("dc10Tca", item); // 전운량

        double rn = parseDouble(rnStr);
        double dsnw = parseDouble(dsnwStr);
        int cloud = parseInt(cloudStr);

        if (dsnw > 0.0) return "눈";
        else if (rn > 0.0) return "비";
        else if (cloud >= 0 && cloud <= 2) return "맑음";
        else if (cloud >= 3 && cloud <= 7) return "구름많음";
        else if (cloud >= 8) return "흐림";
        else return "알 수 없음";
    }

    private String getTagValue(String tag, Node item) {
        Element e = (Element) item;
        NodeList nodeList = e.getElementsByTagName(tag);
        if (nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return "";
    }

    private double parseDouble(String val) {
        try {
            return Double.parseDouble(val);
        } catch (Exception e) {
            return 0.0;
        }
    }

    private int parseInt(String val) {
        try {
            return Integer.parseInt(val);
        } catch (Exception e) {
            return -1;
        }
    }

    private int getNearestStation(double lat, double lon) {
        if (lat >= 37.4 && lat <= 37.7 && lon >= 126.8 && lon <= 127.1) return 108; 
        if (lat >= 35.1 && lat <= 35.3 && lon >= 129.0 && lon <= 129.2) return 159; 
        if (lat >= 35.8 && lat <= 36.0 && lon >= 127.0 && lon <= 127.2) return 133; 
        if (lat >= 35.5 && lat <= 35.7 && lon >= 128.5 && lon <= 128.7) return 143; 
        if (lat >= 35.1 && lat <= 35.3 && lon >= 126.8 && lon <= 127.0) return 156; 
        if (lat >= 37.4 && lat <= 37.6 && lon >= 126.6 && lon <= 126.8) return 112; 
        if (lat >= 37.7 && lat <= 37.9 && lon >= 128.8 && lon <= 129.0) return 211; 
        if (lat >= 33.3 && lat <= 33.6 && lon >= 126.2 && lon <= 126.4) return 184; 
        return -1; 
    }
}
