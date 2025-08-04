import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../../components/tripPlanEdit/DayScheduleList';
import AppLayout from '../../../components/AppLayout';
import EditActionButtons from '../../../components/tripPlanEdit/EditActionButtons';
import TitleModal from '@/components/tripPlan/TitleModal';
import TripPlanToMyTrip from '@/components/tripPlan/TripPlanToMyTrip';
import PlaceSearchModal from '@/components/tripPlanEdit/PlaceSearchModal';
import axios from 'axios';
import { format } from 'date-fns';

const RouteMapNoSSR = dynamic(() => import('../../../components/tripPlan/RouteMap'), {
    ssr: false,
});

const layoutStyle = {
    header: { width: '100%', height: '80px' },
    divider: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
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

const memberTripPlanEdit = () => {
    const router = useRouter();
    const mapRef = useRef(null);
    const TripPlanId = router.query.id;

    const [routeData, setRouteData] = useState([]);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [countPeople, setCountPeople] = useState(null);
    const [countPet, setCountPet] = useState(null);
    const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberId, setMemberId] = useState(1);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('/api/auth/check', {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    setMemberId(response.data.id);
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
            }
        };
        checkLoginStatus();
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchTripById = async (TripPlanId) => {
            try {
                const response = await axios.get(`/memberTripPlan/${TripPlanId}`);
                const trip = response.data;

                if (!trip.routeData || !Array.isArray(trip.routeData)) {
                    throw new Error('잘못된 여행 데이터 형식입니다.');
                }

                const convertedRouteData = trip.routeData.map((day) => ({
                    day: day.day,
                    places: day.places.map((place) => ({
                        placeId: place.placeId,
                        draggableId: `day-${day.day}-place-${place.placeId}`,
                        name: place.name,
                        description: place.description || '',
                        latitude: parseFloat(place.latitude),
                        longitude: parseFloat(place.longitude),
                        imageUrl: place.imageUrl || '',
                    })),
                }));

                setTitle(trip.title);
                setRouteData(convertedRouteData);
                setStartDate(trip.startDate || router.query.startDate);
                setEndDate(trip.endDate || router.query.endDate);
                setCountPeople(trip.countPeople || router.query.countPeople);
                setCountPet(trip.countPet || router.query.countPet);
            } catch (err) {
                console.error('🚨 여행 경로 불러오기 실패:', err);
            }
        };

        if (TripPlanId) {
            fetchTripById(TripPlanId);
        } else if (router.query.data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(router.query.data));
                const parsedRouteData = parsed.map((day) => ({
                    ...day,
                    places: day.places.map((p) => ({
                        ...p,
                        draggableId: `day-${day.day}-place-${p.placeId}`,
                    })),
                }));
                setRouteData(parsedRouteData);
                setStartDate(router.query.startDate);
                setEndDate(router.query.endDate);
                setCountPeople(router.query.countPeople);
                setCountPet(router.query.countPet);
            } catch (e) {
                console.error('데이터 파싱 오류', e);
            }
        }
    }, [TripPlanId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                setKakaoReady(true);
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

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
            console.warn('지도 캡처 오류:', err);
            return null;
        }
    };

    const handleTripSave = async ({
        title,
        startDate: newStartDate,
        endDate: newEndDate,
        countPeople,
        countPet,
        mapImage
    }) => {
        try {
            const originalStart = new Date(startDate);
            const originalEnd = new Date(endDate);
            const originalDays = Math.ceil((originalEnd - originalStart) / (1000 * 60 * 60 * 24)) + 1;

            const newStart = new Date(newStartDate);
            const newEnd = new Date(newEndDate);
            const newDays = Math.ceil((newEnd - newStart) / (1000 * 60 * 60 * 24)) + 1;

            if (newDays < originalDays) {
                alert(`저장할 여행은 최소 ${originalDays}일 이상이어야 합니다.`);
                return false;
            }

            const tripData = {
                title,
                startDate: newStartDate,
                endDate: newEndDate,
                countPeople,
                countPet,
                routeData,
                mapImage,
                memberId,
            };

            await axios.post('/memberTripPlan/recommend/save', tripData);
            alert('여행 저장 완료!');
            router.push('/mypage/trips');
            return true;
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류 발생');
            return false;
        }
    };

    const handleDeletePlace = (day, placeId) => {
        setRouteData((prev) =>
            prev.map((route) =>
                route.day === day
                    ? { ...route, places: route.places.filter((p) => p.placeId !== placeId) }
                    : route
            )
        );
    };

    const handleAddPlace = (place) => {
        setRouteData((prev) =>
            prev.map((dayPlan) =>
                dayPlan.day === currentDay
                    ? {
                        ...dayPlan,
                        places: [
                            ...dayPlan.places,
                            {
                                placeId: place.id,
                                draggableId: `day-${dayPlan.day}-place-${place.id}`,
                                name: place.name,
                                latitude: parseFloat(place.latitude),
                                longitude: parseFloat(place.longitude),
                                description: place.description,
                                imageUrl: place.imageUrl,
                            },
                        ],
                    }
                    : dayPlan
            )
        );
        setIsPlaceSearchOpen(false);
    };

    if (!routeData.length || !kakaoReady) {
        return <div>지도를 불러오는 중입니다...</div>;
    }

    return (
        <AppLayout>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <h1>{title}</h1>
                {startDate && endDate && (
                    <p style={{ fontSize: '16px', color: '#555', marginTop: '4px' }}>
                        {format(new Date(startDate), 'yyyy.MM.dd')} ~{' '}
                        {format(new Date(endDate), 'yyyy.MM.dd')}
                    </p>
                )}
                <div>{countPeople}명 {countPet}견</div>

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
                            onSelectDay={(day) => {
                                setCurrentDay(day);
                                setFocusDay(day);
                            }}
                            onPlaceClick={handlePlaceClick}
                            onDeletePlace={handleDeletePlace}
                            setFocusDay={setFocusDay}
                            setRouteData={setRouteData}
                        />
                        {TripPlanId && (
                            <EditActionButtons
                                onSave={() => setShowModal(true)}
                                onEditPlace={() => setIsPlaceSearchOpen(true)}
                            />
                        )}
                    </div>

                    {isPlaceSearchOpen && (
                        <PlaceSearchModal
                            onClose={() => setIsPlaceSearchOpen(false)}
                            onSelectPlace={handleAddPlace}
                        />
                    )}

                    {showModal && (
                        <TripPlanToMyTrip
                            onClose={() => setShowModal(false)}
                            onSave={handleTripSave}
                            defaultStartDate={startDate}
                            defaultEndDate={endDate}
                            defaultCountPeople={countPeople}
                            defaultCountPet={countPet}
                            onCaptureMap={handleCaptureMap}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default memberTripPlanEdit;
