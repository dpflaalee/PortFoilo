import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../components/tripPlan/DayScheduleList';
import AppLayout from '../../components/AppLayout';
import SearchTripPlanActionButton from '../../components/tripPlan/SearchTripPlanActionButtons';
import axios from 'axios';
import { format } from 'date-fns';

const RouteMapNoSSR = dynamic(() => import('../../components/tripPlan/RouteMap'), {
    ssr: false,
});

const layoutStyle = {
    header: { width: '100%', height: '80px' },
    divider: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: '10px',
        marginBottom: '20px',
    },
    dividerLine: {
        width: '100%',
        border: '1px solid rgba(170, 169, 169, 0.9)',
    },
    contentWrapper: {
        width: '70%',
        height: '80%',
        justifyContent: 'center',
        margin: 'auto',
    },
    contentBox: {
        display: 'flex',
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        margin: 'auto',
    },
    mapContainer: {
        flex: 5,
        width: '100%',
        height: '100%',
    },
    scheduleContainer: {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        maxHeight: '600px',
        paddingRight: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        overscrollBehavior: 'contain',
    },
};

const TripPlanDetail = () => {
    const router = useRouter();
    const mapRef = useRef(null);
    const [routeData, setRouteData] = useState(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [title, setTitle] = useState('');
    const [authorNickname, setAuthorNickname] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [avgRating, setAvgRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [rating, setRating] = useState(0);
    const { id } = router.query;

    // 여행 정보, 로그인 정보 불러오기
    useEffect(() => {
        const fetchTripDetail = async () => {
            const { id } = router.query;
            if (!router.isReady || !id) return;

            try {
                const res = await axios.get(`/tripPlan/${id}`);
                const data = res.data;

                setRouteData(data.routeData || []);
                setTitle(data.title);
                setAuthorNickname(data.authorNickname || '알 수 없음');
                setAuthorId(data.authorId);
                setAvgRating(data.avgRating || 0);
                setRating(data.avgRating || 0);
                setReviewCount(data.reviewCount || 0);
            } catch (err) {
            }
        };

        fetchTripDetail();

        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('/api/auth/check', {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    setUserId(response.data.id);
                }
            } catch (error) {
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
            }
        };

        checkLoginStatus();
    }, [router.isReady, router.query]);

    // 지도 그리기
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                setKakaoReady(true);
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    if (!routeData || !Array.isArray(routeData)) {
        return <div>경로 데이터를 불러오는 중입니다...</div>;
    }

    const currentPlan = routeData.find((r) => Number(r.day) === currentDay);
    if (!currentPlan || !currentPlan.places || !kakaoReady) {
        return <div>지도를 불러오는 중입니다...</div>;
    }

    const handlePlaceClick = (place, day) => {
        setFocusDay(day);
        if (mapInstance && window.kakao) {
            const latlng = new window.kakao.maps.LatLng(
                parseFloat(place.latitude),
                parseFloat(place.longitude)
            );
            mapInstance.panTo(latlng);
        }
    };

    const handleCaptureMap = async () => {
        try {
            return await mapRef.current?.captureMap();
        } catch (err) {
            return null;
        }
    };

    const handleEditAndSave = async () => {
        let mapImageBase64 = null;

        try {
            mapImageBase64 = await handleCaptureMap();
        } catch (err) {
        }

        const travelData = {
            title,
            startDate,
            endDate,
            countPeople,
            countPet,
            mapImage: mapImageBase64,
            routeData,
        };

        try {
            const res = await axios.post('/tripPlan/edit', travelData);
            const tripId = res.data?.tripId;
            if (tripId) {
                router.push({
                    pathname: `/tripPlan/tripPlanEdit/${tripId}`,
                    query: {
                        id: tripId,
                        startDate,
                        endDate,
                    },
                });
            } else {
                alert('여행 저장 후 이동 실패');
            }
        } catch (err) {
            alert('저장 실패');
        }
    };
    const myTrip = Number(authorId) === Number(userId);
    
    //////
    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <h1>{title || '여행 상세 보기'}</h1>
                    {authorNickname && (
                        <p style={{ fontSize: '15px', color: '#666', marginLeft: '10px' }}>
                            {authorNickname}
                        </p>
                    )}
                </div>
                <div
                    style={{ display: 'flex', alignItems: 'center', marginTop: '4px', gap: '6px', cursor: 'pointer' }}
                    onClick={async () => {
                        let mapImageBase64 = null;
                        try {
                            mapImageBase64 = await handleCaptureMap();
                        } catch (err) {
                            console.warn('지도 캡처 실패:', err);
                        }

                        router.push({
                            pathname: `/review/tripPlan/${id}`,
                            query: {
                                title: title || '',
                                mapImage: mapImageBase64 || '', // 지도 이미지도 query로 함께 전송
                            },
                        });
                    }}
                >
                    <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                        {rating?.toFixed(1) || '0.0'}
                    </p>
                    <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                        {'★'.repeat(Math.floor(rating || 0)) + '☆'.repeat(5 - Math.floor(rating || 0))}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        | 리뷰 {reviewCount || 0}
                    </p>
                </div>
                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>

                <div style={layoutStyle.contentBox}>
                    <div id="map-capture-target" style={layoutStyle.mapContainer}>
                        <RouteMapNoSSR
                            ref={mapRef}
                            routeData={routeData}
                            focusDay={focusDay}
                            setFocusDay={setFocusDay}
                            setMapInstance={setMapInstance}
                        />
                    </div>

                    <div style={layoutStyle.scheduleContainer}>
                        <DayScheduleList
                            id="scheduleContainer"
                            routeData={routeData}
                            currentDay={currentDay}
                            onSelectDay={setCurrentDay}
                            onPlaceClick={handlePlaceClick}
                            setFocusDay={setFocusDay}
                        />
                        <SearchTripPlanActionButton
                            onEdit={() => handleEditAndSave()}
                            tripPlanId={id}
                            myTrip={myTrip}
                            myId={userId}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TripPlanDetail;
