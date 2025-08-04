import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const bottonWrapperStyle = {
    //border: '2px solid purple',
    width: '100%',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',   // 세로 정렬
    alignItems: 'center',
    border: 'none',
}


const bottonStyle = {
    //border: '2px solid red',
    margin: '6px',
    width: '80%',
    height: '50px',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5em',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',

}

const ActionButtons = ({ planData, onEdit, isNotMytrip, routeData, memberTripPlanId, originTripPlanId }) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [hasWrittenReview, setHasWrittenReview] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('/api/auth/check', {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    setUserId(response.data.id);
                    setUserName(response.data.username);
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                router.push('/member/login');
            }
        };

        checkLoginStatus();
    }, [])

    useEffect(() => {
        const checkReviewWritten = async () => {
            if (!userId || !originTripPlanId) return;

            try {
                const res = await axios.get('/review/check', {
                    params: { memberId: userId, planId: originTripPlanId },
                    withCredentials: true,
                });
                setHasWrittenReview(res.data); // true or false
            } catch (err) {
                console.error('리뷰 작성 여부 확인 실패:', err);
            }
        };

        if (userId && originTripPlanId) {
            checkReviewWritten();
        }
    }, [userId, originTripPlanId]);

    const handleReservation = async () => {
        try {
            const response = await axios.post('/reserv/auto/plan', {
                userId: userId,
                memberTripPlanId: memberTripPlanId,
                originTripPlanId: originTripPlanId,
                routeData: routeData,
            });

            const reservations = response.data;
            
            if (!reservations || reservations.length === 0) {
                alert('예약이 생성되지 않았습니다.');
                return;
            }

            const firstMemberTripPlanId = reservations[0]?.memberTripPlan?.id;
            const allSame = reservations.every(r => r.memberTripPlan?.id === firstMemberTripPlanId);

            if (!allSame) {
                alert('예약들의 memberTripPlanId가 서로 다릅니다. 일괄결제가 불가능합니다.');
                return;
            }

            router.push({
                pathname: '/pay/paybatch',
                query: { memberTripPlanId: firstMemberTripPlanId }
            });
        } catch (error) {
            console.error('예약 생성 실패', error);
        }
    };

    const handleWriteReview = async () => {
        try {
            const res = await axios.get(`/review/member-trip-plan/${memberTripPlanId}`);
            const tripPlan = res.data?.tripPlan;

            if (!tripPlan?.id) {
                alert('tripPlan 정보를 가져올 수 없습니다.');
                return;
            }

            router.push({
                pathname: '/review/write',
                query: {
                    reviewTypeId: 1,
                    targetId: tripPlan.id,
                    title: tripPlan.title || '',
                },
            });
        } catch (err) {
            console.error('리뷰 작성용 트립플랜 조회 실패:', err);
            alert('리뷰 작성 정보를 불러오는 데 실패했습니다.');
        }
    };

    return (
        <div style={bottonWrapperStyle}>
            <button style={{ ...bottonStyle, background: 'blue' }}
                onClick={onEdit}>
                이 여행으로 다시 만들기
            </button>
            <button
                style={{ ...bottonStyle, background: 'black' }} onClick={handleReservation}>
                이대로 예약하기
            </button>
            {isNotMytrip && !hasWrittenReview && (
                <button
                    style={{ ...bottonStyle, background: 'green' }}
                    onClick={handleWriteReview}
                >
                    리뷰쓰기
                </button>
            )}
        </div>
    );
};

export default ActionButtons;
