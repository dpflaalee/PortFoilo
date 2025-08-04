import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const TripPlanSearch = ({ keyword, setKeyword, handleSearch, handleKeyPress, handleSearchClick }) => {
    const recommendedKeywords = [
        '🧐 어디를 가볼까요?', '서울 여행',
        '🧐 어디를 가볼까요?', ' 관광지',
        '🧐 어디를 가볼까요?', ' 제주도 맛집',
        '🧐 어디를 가볼까요?', ' 맛집',
        '🧐 어디를 가볼까요?', ' 반려견 동반 카페',
        '🧐 어디를 가볼까요?', '  레포츠',
        '🧐 어디를 가볼까요?', ' 숙박',
        '🧐 어디를 가볼까요?', '  쇼핑',
        '🧐 어디를 가볼까요?', '  호텔'
    ];

    const [placeholder, setPlaceholder] = useState(recommendedKeywords[0]);
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true); // fade 애니메이션용

    useEffect(() => {
        if (keyword) return; // 사용자가 입력 중이면 변경 멈춤

        const interval = setInterval(() => {
            setFade(false); // fade out

            setTimeout(() => {
                const nextIndex = (index + 1) % recommendedKeywords.length;
                setPlaceholder(recommendedKeywords[nextIndex]);
                setIndex(nextIndex);
                setFade(true); // fade in
            }, 300); // fade out 후 placeholder 변경
        }, 3000);

        return () => clearInterval(interval);
    }, [index, keyword]);

    const containerStyle = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    };

    const contentStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        color: 'white',
        textAlign: 'center',
    };

    const boxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '24px',
        borderRadius: '16px',
        width: '100%',
        color: 'black',
        marginTop: '50px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.52)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '480px',
        marginRight: '20px',
        fontSize: '1.1rem',
        transition: 'opacity 0.3s ease-in-out',
        opacity: fade ? 1 : 0,
    };

    return (
        <div style={containerStyle}>
            <div style={overlayStyle} />
            <div style={contentStyle}>
                <div style={{ width: '100%', maxWidth: '960px' }}>
                    <Image
                        src="/image/logo/TripPaw-logo.png"
                        alt="logo"
                        width={480}
                        height={120}
                        priority
                    />
                    <div style={boxStyle}>
                        <Image
                            src="/image/other/search-normal.png"
                            alt="search icon"
                            width={25}
                            height={30}
                            priority
                        />
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder={placeholder}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Image
                            src="/image/other/send.png"
                            alt="search button"
                            width={45}
                            height={30}
                            priority
                            onClick={handleSearch}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripPlanSearch;
