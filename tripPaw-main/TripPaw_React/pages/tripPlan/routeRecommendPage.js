import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DayScheduleList from '../../components/tripPlan/DayScheduleList';
import AppLayout from '../../components/AppLayout';
import ActionButtons from '../../components/tripPlan/ActionButtons';
import TitleModal from '../../components/tripPlan/TitleModal';
import LoginFormModal from '../../components/member/LoginFormModal';
import PetAssistantLoading from '../../components/pet/PetassistantLoading';
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
        opacity: 0,
        animation: 'fadeIn 0.6s ease forwards',
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

//페이드인 애니메이션을 위한 CSS
const fadeStyle = `
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

const RouteRecommendPage = () => {
    const router = useRouter();
    const mapRef = useRef(null);

    const [routeData, setRouteData] = useState(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [kakaoReady, setKakaoReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [focusDay, setFocusDay] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [countPeople, setCountPeople] = useState(null);
    const [countPet, setCountPet] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberId, setMemberId] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [isPageReady, setIsPageReady] = useState(false);

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
                if (error.response?.status === 401) {
                    setIsLoggedIn(false);
                } else {
                }
            }
        };

        checkLoginStatus();
    }, [router.isReady, router.query]);

    const requestData = useMemo(() => {
        if (!router.query.req) return null;
        try {
            return JSON.parse(decodeURIComponent(router.query.req));
        } catch (e) {
            return null;
        }
    }, [router.query.req]);

    useEffect(() => {
        if (!router.query.data) {
            alert("추천된 경로가 없습니다. 다시 시도해주세요.");
            router.replace('/');
            return;
        }
        try {
            const parsed = JSON.parse(decodeURIComponent(router.query.data));
            if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
                alert("추천된 경로가 없습니다. 다른 조건으로 시도해주세요.");
                router.replace('/');
            }
        } catch (e) {
            alert("경로 데이터 파싱 실패. 다시 시도해주세요.");
            router.replace('/');
        }
    }, [router.query.data]);

    useEffect(() => {
        if (requestData) {
            setCountPeople(requestData.countPeople || 0);
            setCountPet(requestData.countPet || 0);
        }
    }, [requestData]);

    useEffect(() => {
        if (router.query.data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(router.query.data));
                setRouteData(parsed);
            } catch (e) {
            }
        }
    }, [router.query]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                setKakaoReady(true);
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (routeData && kakaoReady) {
            setTimeout(() => setIsPageReady(true), 100);
        }
    }, [routeData, kakaoReady]);

    const currentPlan = routeData?.find((r) => r.day === currentDay);

    if (!isPageReady || !routeData || !currentPlan) {
        return (
            <>
                <style>{fadeStyle}</style>
                <div>
                    <PetAssistantLoading reservState={!routeData ? 'FETCHING_DATA' : 'MAP_LOADING'} />
                </div>
            </>
        );
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

    const handleTripSave = async ({ title, startDate, endDate, countPeople, countPet, mapImage }, overrideMemberId) => {
        const effectiveMemberId = overrideMemberId || memberId;
        if (!effectiveMemberId) {
            alert('로그인 정보가 유실되었습니다. 다시 시도해주세요.');
            return;
        }
        try {
            const tripData = {
                title,
                startDate,
                endDate,
                countPeople,
                countPet,
                routeData,
                mapImage,
                memberId: effectiveMemberId,
            };
            await axios.post('/memberTripPlan/recommend/save', tripData);
            alert('여행 저장 완료!');
            setShowModal(false);
            await router.push('/mypage/trips');
        } catch (error) {
            alert('저장 중 오류 발생');
        }
    };

    const handleEditforSave = async () => {
        let mapImageBase64 = null;
        try {
            mapImageBase64 = await handleCaptureMap();
        } catch (err) {
            console.warn('지도 캡처 실패:', err);
        }
        const travelData = {
            title: 'TripPlanForEdit',
            startDate: requestData?.startDate,
            endDate: requestData?.endDate,
            countPeople: requestData?.countPeople,
            countPet: requestData?.countPet,
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
                        startDate: requestData?.startDate,
                        endDate: requestData?.endDate,
                        countPeople: requestData?.countPeople,
                        countPet: requestData?.countPet,
                    },
                });
            } else {
                alert('여행 저장 후 이동 실패');
            }
        } catch (err) {
            alert('저장 실패');
        }
    };

    const checkLoginAndProceed = (action) => {
        if (isLoggedIn && memberId) {
            action(memberId);
        } else {
            setPendingAction(() => (id) => action(id));
            setShowLoginModal(true);
        }
    };

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setMemberId(userData.id);
        setShowLoginModal(false);
        if (pendingAction) {
            pendingAction(userData.id);
            setPendingAction(null);
        }
    };

    return (
        <AppLayout>
            <style>{fadeStyle}</style>
            <div style={layoutStyle.header} />
            <div style={layoutStyle.contentWrapper}>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <div style={{ marginRight: '10px' }}>
                        <h1>TripPaw가 추천하는 맞춤 여행</h1>
                    </div>
                    <div style={{ marginBottom: '3px' }}>
                        {requestData?.startDate && requestData?.endDate && (
                            <p style={{ fontSize: '16px', color: '#555', marginTop: '4px' }}>
                                {format(new Date(requestData.startDate), 'yyyy.MM.dd')} ~{' '}
                                {format(new Date(requestData.endDate), 'yyyy.MM.dd')}
                            </p>
                        )}
                    </div>
                </div>
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
                        {routeData && (
                            <DayScheduleList
                                routeData={routeData}
                                currentDay={currentDay}
                                onSelectDay={setCurrentDay}
                                onPlaceClick={handlePlaceClick}
                                setFocusDay={setFocusDay}
                            />
                        )}
                        <ActionButtons
                            onSave={() => checkLoginAndProceed((id) => setShowModal(true))}
                            onEditforSave={() => checkLoginAndProceed(() => handleEditforSave())}
                        />
                    </div>

                    {showModal && (
                        <TitleModal
                            onClose={() => setShowModal(false)}
                            onSave={(params) => handleTripSave(params, memberId)}
                            defaultStartDate={requestData?.startDate}
                            defaultEndDate={requestData?.endDate}
                            defaultCountPeople={requestData?.countPeople}
                            defaultCountPet={requestData?.countPet}
                            onCaptureMap={handleCaptureMap}
                            memberId={memberId}
                        />
                    )}

                    {showLoginModal && (
                        <LoginFormModal
                            onLoginSuccess={handleLoginSuccess}
                            onToggleForm={() => setShowLoginModal(false)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default RouteRecommendPage;
