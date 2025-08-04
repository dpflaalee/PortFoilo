import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PlaceDetailModal from './PlaceDetailModal';

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    width: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
};

const selectStyle = {
    padding: '6px',
    marginLeft: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '35px'
};

const PlaceSearchModal = ({ onClose, onSelectPlace }) => {
    const [keyword, setKeyword] = useState('');
    const [region, setRegion] = useState('');
    const [results, setResults] = useState([]);
    const [resultIds, setResultIds] = useState(new Set());
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef();

    const handleSearch = async () => {
        setHasSearched(true);
        setOffset(0);
        setHasMore(true);
        setResultIds(new Set()); // 초기화
        try {
            const response = await axios.get('/search', {
                params: {
                    keyword,
                    region,
                    offset,
                }
            });
            const places = Array.isArray(response.data.places) ? response.data.places : [];
            const ids = new Set(places.map(p => p.id));
            setResults(places);
            setResultIds(ids);
            if (places.length < 5) setHasMore(false);
            else setOffset(5);
        } catch (err) {
            console.error('검색 실패:', err);
            setResults([]);
        }
    };

    const getFallbackImages = (items) => {
        const map = {};
        items.forEach(item => {
            const randomNum = Math.floor(Math.random() * 10) + 1;
            map[item.id] = `/image/other/randomImage/${randomNum}.jpg`;
        });
        return map;
    };

    const fallbackImages = useMemo(() => getFallbackImages(results), [results]);

    const fetchMoreResults = useCallback(async () => {
        try {
            const query = `/search?keyword=${encodeURIComponent(keyword)}${region ? `&region=${encodeURIComponent(region)}` : ''}&offset=${offset}`;
            const response = await axios.get(query);
            const newPlaces = Array.isArray(response.data.places) ? response.data.places : [];

            const uniquePlaces = newPlaces.filter(place => !resultIds.has(place.id));
            if (uniquePlaces.length === 0) {
                setHasMore(false);
            } else {
                setResults(prev => [...prev, ...uniquePlaces]);
                setResultIds(prev => {
                    const newSet = new Set(prev);
                    uniquePlaces.forEach(place => newSet.add(place.id));
                    return newSet;
                });
                setOffset(prev => prev + 5);
            }
        } catch (err) {
            console.error('더 불러오기 실패:', err);
        }
    }, [keyword, region, offset, resultIds]);

    useEffect(() => {
        const handleScroll = () => {
            const container = scrollRef.current;
            if (!container || !hasMore) return;

            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100) {
                fetchMoreResults();
            }
        };

        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
        };
    }, [fetchMoreResults, hasMore]);

    return (
        <>
            <div style={overlayStyle} onClick={onClose} />
            <div style={modalStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                        <select style={selectStyle} value={region} onChange={(e) => setRegion(e.target.value)}>
                            <option value="">-- 지역 선택 --</option>
                            <option value="서울">서울</option>
                            <option value="부산">부산</option>
                            <option value="제주">제주</option>
                            <option value="인천">인천</option>
                            <option value="광주">광주</option>
                            <option value="대전">대전</option>
                            <option value="울산">울산</option>
                            <option value="경기">경기</option>
                            <option value="강원">강원</option>
                            <option value="충청">충청</option>
                            <option value="전라">전라</option>
                            <option value="경상">경상</option>
                        </select>
                    </div>
                    <div style={{ borderBottom: '2px solid rgba(155, 155, 155, 0.36)', width: '45%', padding: '10px', marginRight: '10px' }}>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="장소 이름 입력"
                            style={{ width: '100%', marginBottom: '0px', border: 'none' }}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        style={{
                            marginBottom: '10px',
                            width: '20%',
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            height: '38px',
                            marginTop: '10px'
                        }}
                    >
                        찾아보기
                    </button>
                </div>
                <div ref={scrollRef} style={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '20px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
                        {hasSearched && results.length === 0 && (
                            <li style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                                검색 결과가 없습니다.
                            </li>
                        )}
                        {results.map((place) => (
                            <li
                                key={place.id}
                                style={{
                                    margin: '10px 0',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ display: 'flex' }}>
                                        <img
                                            src={place.imageUrl || fallbackImages[place.id]}
                                            alt={place.name}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '0px'
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <div style={{ margin: '0px 0px', width: '100%' }}>{place.name}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                                {place.avgRating?.toFixed(1) || '0.0'}
                                            </p>
                                            <p style={{ fontSize: '14px', color: '#f44336', margin: 0 }}>
                                                {'★'.repeat(Math.floor(place.avgRating)) + '☆'.repeat(5 - Math.floor(place.avgRating))}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                                | 리뷰 {place.reviewCount || 0}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#666' }}>{place.region}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                                        <button
                                            onClick={() => onSelectPlace(place)}
                                            style={{ backgroundColor: 'black', color: 'white', height: '30px', cursor: 'pointer' }}
                                        >추가</button>
                                        <button
                                            onClick={() => setSelectedPlace(place)}
                                            style={{ backgroundColor: 'black', color: 'white', height: '30px', cursor: 'pointer' }}
                                        >자세히</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {selectedPlace && (
                        <PlaceDetailModal
                            place={selectedPlace}
                            onClose={() => setSelectedPlace(null)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default PlaceSearchModal;
