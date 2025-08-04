import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const modalStyleBase = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '10px',
    width: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: 9999,
};

const PlaceDetailModal = ({ place, onClose, anchorRef }) => {
    const modalRef = useRef(null);
    const [position, setPosition] = useState({ top: 100, left: 100 });
    const [placeDetail, setPlaceDetail] = useState(null);

    const fallbackImage = useMemo(() => {
        const randomNum = Math.floor(Math.random() * 10) + 1;
        return `/image/other/randomImage/${randomNum}.jpg`;
    }, []);

    //데이터가 부족한 경우 보완 요청
    useEffect(() => {
        if (!place) return;

        const fetchDetail = async () => {
            try {
                // 데이터 보완이 필요할 경우
                if (!place.region || !place.imageUrl || !place.parking) {
                    if (!place.placeId) {
                        console.warn('유효하지 않은 placeId:', place);
                        setPlaceDetail(place);
                        return;
                    }

                    const { data } = await axios.get(`/place/${place.placeId}`);
                    setPlaceDetail({ ...place, ...data });
                } else {
                    setPlaceDetail(place);
                }
            } catch (error) {
                console.error('상세 장소 정보 요청 실패:', error);
                setPlaceDetail(place); // 최소한 기존 데이터라도 보여주자
            }
        };

        fetchDetail();
    }, [place]);

    //위치 계산 및 모달 띄우기
    useEffect(() => {
        if (anchorRef?.current && modalRef.current) {
            const anchorRect = anchorRef.current.getBoundingClientRect();
            const modal = modalRef.current;

            const modalWidth = modal.offsetWidth;
            const modalHeight = modal.offsetHeight;

            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const scrollX = window.scrollX || document.documentElement.scrollLeft;

            let top = anchorRect.bottom + scrollY + 8;
            let left = anchorRect.left + scrollX;

            if (top + modalHeight > window.innerHeight + scrollY) {
                top = anchorRect.top + scrollY - modalHeight - 8;
            }

            if (left + modalWidth > window.innerWidth + scrollX) {
                left = window.innerWidth + scrollX - modalWidth - 20;
            }

            if (left < 20) left = 20;
            if (top < 20) top = 20;

            setPosition({ top, left });
        }
    }, [anchorRef, place]);

    //외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                !anchorRef?.current?.contains(e.target)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, anchorRef]);

    if (!placeDetail) return null;

    //모달 내용
    const modalContent = (
        <div
            style={{
                ...modalStyleBase,
                top: position.top,
                left: position.left,
            }}
            ref={modalRef}
        >
            <h2 style={{ marginBottom: '12px' }}>{placeDetail.name}</h2>

            <img
                src={placeDetail.imageUrl || fallbackImage}
                alt="장소 이미지"
                style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '16px',
                }}
            />

            <p style={{ padding: '10px', fontSize: '14px', lineHeight: '1.6' }}>
                {placeDetail.description || (
                    <div>
                        낯선 길 위를 걷고 있을 때, 가장 큰 위로는 곁에 있는 존재에서 옵니다.<br />
                        이곳은 그런 위로가 자연스럽게 스며드는 공간입니다.<br />
                        당신과 반려동물이 오랫동안 간직하고 싶은 추억을 만들어보세요.
                    </div>
                )}
            </p>

            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <img src='/image/other/location.png' alt='장소' style={{ width: '16px', marginRight: '6px' }} />
                {placeDetail.region}
            </div>

            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <img src='/image/other/call-calling.png' alt='전화번호' style={{ width: '16px', marginRight: '6px' }} />
                {placeDetail.phone || '010-1234-1234'}
            </div>

            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <img src='/image/other/clock.png' alt='운영시간' style={{ width: '16px', marginRight: '6px' }} />
                {placeDetail.openHours || '운영시간 정보 없음'}
            </div>

            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <img src='/image/other/verify.png' alt='주차 가능 여부' style={{ width: '16px', marginRight: '6px' }} />
                주차: {placeDetail.parking || '주차 정보 없음'}
            </div>

            <div style={{ textAlign: 'right' }}>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    닫기
                </button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default PlaceDetailModal;
