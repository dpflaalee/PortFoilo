import React, { useEffect, useState, useRef } from 'react';
import {CloseOutlined} from '@ant-design/icons';
import { useRouter } from 'next/router';

const KakaoMap = ({ userName = '홍길동' }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const placesRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || mapContainer.hasChildNodes()) return;

    if (!document.getElementById('kakao-map-script')) {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=75091682b75aa23bbfb4b9c8e7ad6b2a&libraries=services&autoload=false";
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          loadMap();
        });
      };

      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) {
        loadMap();
      }
    }

    function loadMap() {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.56800, 126.98098),
        level: 4,
        mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      mapRef.current = map;

      window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      });

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(37.56800, 126.98098),
        draggable: true,
        map: map,
      });
      markerRef.current = marker;

      window.kakao.maps.event.addListener(marker, 'click', () => {
        const position = marker.getPosition();
        const lat = position.getLat();
        const lng = position.getLng();

        const encodedUserName = encodeURIComponent(userName);

        const link = `https://map.kakao.com/link/map/${encodedUserName},${lat},${lng}`;

        localStorage.setItem('kakaoMapLink', link);
        alert('위치 링크가 저장되었습니다. 글쓰기 화면에서 확인하세요!');
        router.push('/main'); // 글쓰기 페이지로 이동
      });

          const ps = new window.kakao.maps.services.Places();
          placesRef.current = ps;
        }
      }, []);

  const handleSearch = () => {
    const ps = placesRef.current;
    const map = mapRef.current;
    const marker = markerRef.current;

    if (!ps) {
      alert('지도 서비스가 아직 준비되지 않았습니다.');
      return;
    }

    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요');
      return;
    }

    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const firstPlace = data[0];
        const newPos = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
        map.setCenter(newPos);
        marker.setPosition(newPos);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="장소를 검색하세요"
          style={{ padding: 5, width: 300 }}
        />
        <button onClick={handleSearch} style={{ marginLeft: 5, padding: '5px 10px' }}>검색</button>
      </div>

      <CloseOutlined
        onClick={() => router.push('/main')}
        style={{
          position: 'absolute',
          top: 60,
          right: 40,
          fontSize: 22,
          color: '#555',
          cursor: 'pointer',
          zIndex: 10,
        }}
      />

      <div
        id="map"
        style={{
          width: '90%',
          maxWidth: '1000px',
          height: '650px',
        }}       
      />
    </div>
  );
};

export default KakaoMap;
