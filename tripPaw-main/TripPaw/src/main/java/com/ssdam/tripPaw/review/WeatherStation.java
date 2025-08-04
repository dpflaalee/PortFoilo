package com.ssdam.tripPaw.review;

public class WeatherStation {
	private final String stnId;  // 기상청 관측소 ID (예: "108")
    private final String name;   // 관측소 이름 (예: 서울, 부산 등)
    private final double lat;    // 위도
    private final double lng;    // 경도

    public WeatherStation(String stnId, String name, double lat, double lng) {
        this.stnId = stnId;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }

    public String getStnId() {
        return stnId;
    }

    public String getName() {
        return name;
    }

    public double getLat() {
        return lat;
    }

    public double getLng() {
        return lng;
    }
}
