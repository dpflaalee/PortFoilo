import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useRouter } from "next/router";
import MypageLayout from "@/components/layout/MyPageLayout";
import { EllipsisOutlined } from "@ant-design/icons";
import PublicConfirmModal from "@/components/tripPlan/PublicConfirmModal";
import dayjs from "dayjs"; 

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
};

const Trips = () => {
    const router = useRouter();
    const [memberId, setMemberId] = useState(null);
    const [tab, setTab] = useState("mytrips");
    const [trips, setTrips] = useState([]);
    const [fallbackImages, setFallbackImages] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(""); 

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('/api/auth/check', {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setMemberId(response.data.id);
                }
            } catch (error) {
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
            }
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (!memberId) return;

        const fetchTrips = async () => {
            try {
                const url =
                    tab === "mytrips"
                        ? `/memberTripPlan/${memberId}/mytrips`
                        : `/tripPlan/${memberId}/trips`;

                const response = await axios.get(url);
                const data = response.data;
                setTrips(data);

                const fallbackMap = {};
                data.forEach(trip => {
                    const tripId = trip.tripPlanId || trip.id;
                    const randomNum = Math.floor(Math.random() * 10) + 1;
                    fallbackMap[tripId] = `/image/other/randomImage/${randomNum}.jpg`;
                });
                setFallbackImages(fallbackMap);
            } catch (error) {
                console.error('여행 목록 불러오기 실패:', error);
                setTrips([]);
            }
        };

        fetchTrips();
    }, [memberId, tab]);

    const handleTabChange = (newTab) => {
        setTab(newTab);
        setSelectedMonth(""); // 탭 바꾸면 필터 초기화
    };

    const TripCard = ({ trip }) => {
        const tripId = trip.myTripId || trip.id;
        const imageUrl = trip.imageUrl && trip.imageUrl.length > 0
            ? trip.imageUrl
            : fallbackImages[tripId] || "/image/other/tempImage.jpg";

        const [menuOpen, setMenuOpen] = useState(false);
        const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
        const [showModal, setShowModal] = useState(false);
        const iconRef = useRef(null);
        const menuRef = useRef(null);

        const reviewCount = trip.reviews?.length || 0;
        const avgRating = reviewCount > 0
            ? (trip.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
            : '0.0';

        const toggleMenu = (e) => {
            e.stopPropagation();
            const rect = iconRef.current.getBoundingClientRect();
            setMenuPosition({ x: rect.left, y: rect.bottom + window.scrollY });
            setMenuOpen(!menuOpen);
        };

        const handleDelete = async (e) => {
            e.stopPropagation();
            const url =
                tab === "mytrips"
                    ? `/memberTripPlan/${trip.myTripId}`
                    : `/tripPlan/${trip.id}`;

            const confirmMessage =
                tab === "mytrips"
                    ? "삭제 된 여행은 복구하기 어렵습니다. 정말 삭제하시겠습니까?"
                    : "공개로 전환된 여행일 경우 완전 삭제 되지 않습니다. 내 페이지에서 숨김 처리 하시겠습니까? 이 과정은 복구되지 않습니다.";

            if (window.confirm(confirmMessage)) {
                try {
                    await axios.delete(url);
                    alert("삭제되었습니다.");
                    setMenuOpen(false);
                    setTrips(prev => prev.filter(t => (t.id || t.myTripId) !== (trip.id || trip.myTripId)));
                } catch (error) {
                    alert("삭제에 실패했습니다.");
                }
            }
        };

        const requestPublish = async () => {
            try {
                await axios.put(`/tripPlan/${trip.id}/public`);
                alert("여행이 공개로 전환되었습니다.");
                setMenuOpen(false);
                setShowModal(false);
            } catch (error) {
                alert(error.response?.data || "공개 처리 중 오류가 발생했습니다.");
            }
        };

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setMenuOpen(false);
                }
            };
            if (menuOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [menuOpen]);

        return (
            <>
                <div
                    key={tripId}
                    onClick={() =>
                        router.push(tab === "mytrips"
                            ? `/memberTripPlan/${tripId}`
                            : `/tripPlan/${tripId}`)}
                    style={{
                        borderRadius: '16px',
                        backgroundColor: 'white',
                        width: '400px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        overflow: 'visible',
                        position: 'relative',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                        <img
                            alt="여행 이미지"
                            src={imageUrl}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/image/other/tempImage.jpg";
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{ padding: '16px' }}>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {trip.title}
                            <div ref={iconRef}>
                                <EllipsisOutlined onClick={toggleMenu} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                        {trip.startDate && trip.endDate && (
                            <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                                {trip.startDate} ~ {trip.endDate}
                            </div>
                        )}
                        {tab === "created" && (
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', gap: '6px' }}>
                                <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>{avgRating}</p>
                                <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                    {'★'.repeat(Math.floor(avgRating)) + '☆'.repeat(5 - Math.floor(avgRating))}
                                </p>
                                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                    | 리뷰 {reviewCount}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {menuOpen && ReactDOM.createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: 'absolute',
                            top: `${menuPosition.y}px`,
                            left: `${menuPosition.x}px`,
                            width: '120px',
                            backgroundColor: '#fff',
                            border: '2px solid #ccc',
                            borderRadius: '16px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                            zIndex: 9999,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {tab === "created" && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal(true);
                                    setMenuOpen(false);
                                }}
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #ddd',
                                    cursor: 'pointer'
                                }}
                            >
                                공개하기
                            </div>
                        )}
                        <div
                            onClick={handleDelete}
                            style={{
                                padding: '12px',
                                textAlign: 'center',
                                color: 'red',
                                cursor: 'pointer'
                            }}
                        >
                            삭제하기
                        </div>
                    </div>,
                    document.body
                )}

                {showModal && (
                    <PublicConfirmModal
                        onCancel={() => setShowModal(false)}
                        onConfirm={requestPublish}
                    />
                )}
            </>
        );
    };

    // ✅ 월별 그룹화 후 선택된 달만 필터링
    const groupedTrips = trips.reduce((acc, trip) => {
        const date = trip.startDate || trip.createdAt;
        const monthKey = dayjs(date).format("YYYY-MM");
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(trip);
        return acc;
    }, {});

    const filteredGroupedTrips = selectedMonth
        ? { [selectedMonth]: groupedTrips[selectedMonth] || [] }
        : groupedTrips;

    return (
        <MypageLayout>
            <div>
                <div>마이페이지 &gt; 내 여행</div>
                <h2 style={{ margin: '20px 0' }}>내 여행</h2>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button
                        onClick={() => handleTabChange("mytrips")}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            backgroundColor: tab === "mytrips" ? '#333' : '#fff',
                            color: tab === "mytrips" ? '#fff' : '#333',
                            cursor: 'pointer',
                        }}
                    >
                        내가 다녀온 여행
                    </button>
                    <button
                        onClick={() => handleTabChange("created")}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            backgroundColor: tab === "created" ? '#333' : '#fff',
                            color: tab === "created" ? '#fff' : '#333',
                            cursor: 'pointer',
                        }}
                    >
                        내가 만든 여행
                    </button>

                    {/* ✅ 월 선택 필터 */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{
                            padding: '8px',
                            marginLeft: 'auto',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            width: '10%'
                        }}
                    >
                        <option value="">전체 보기</option>
                        {Object.keys(groupedTrips)
                            .sort((a, b) => b.localeCompare(a))
                            .map(month => (
                                <option key={month} value={month}>
                                    {dayjs(month).format("YYYY년 MM월")}
                                </option>
                            ))}
                    </select>
                </div>

                <div style={layoutStyle.divider}>
                    <div style={layoutStyle.dividerLine} />
                </div>

                {trips.length === 0 ? (
                    <p>여행이 없습니다.</p>
                ) : (
                    Object.entries(filteredGroupedTrips)
                        .sort((a, b) => b[0].localeCompare(a[0]))
                        .map(([month, monthTrips]) => (
                            <div key={month} style={{ marginBottom: '40px', width: '100%' }}>
                                <h3 style={{ marginBottom: '12px' }}>{dayjs(month).format("YYYY년 MM월")}</h3>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}>
                                    {monthTrips.map((trip) => (
                                        <TripCard key={trip.id || trip.myTripId} trip={trip} />
                                    ))}
                                </div>
                            </div>
                        ))
                )}
            </div>
        </MypageLayout>
    );
};

export default Trips;
