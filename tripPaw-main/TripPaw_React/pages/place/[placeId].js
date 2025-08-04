import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import PetAssistant from '../../components/pet/petassistant';
import styled from 'styled-components';
import AppLayout from '@/components/AppLayout';
import { Tabs, Rate, Avatar, Button, Spin, Pagination } from 'antd';
import {SunOutlined, QuestionOutlined} from '@ant-design/icons';
import LoginFormModal from '@/components/member/LoginFormModal';
import PetassistantLoading from '@/components/pet/PetassistantLoading';


const { TabPane } = Tabs;

const ScrollContainer = styled.div`
  width: 100%;
  cursor: s-resize;
  height: calc(100vh - 240px);
  overflow-y: auto !important;

  &::-webkit-scrollbar {
    display: none !important;
  }

  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
`;

const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  border-radius: 16px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 40px;
  color: #222;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  height: calc(100vh - 240px);
`;

const ImageSection = styled.div`
  flex: 1;
  min-width: 300px;
  height: 100%;
  p {
    color: #555;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  img.place-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }
  img.favorite-icon {
    position: absolute;
    top: -5px;
    right: 12px;
    width: 60px;
    height: 55px;
    cursor: pointer;
  }
`;

const Form = styled.form`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ExpireText = styled.p`
  font-size: 0.95rem;
  color: #666;
`;

const SubmitButton = styled.button`
  background-color: #2c7be5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s;
  &:hover {
    background-color: #1a5edb;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-weight: bold;
`;

const TabsSection = styled.div`
  flex: 1;
  min-width: 300px;
  height: 100%;
  //overflow-y: auto;
  overflow: hidden;
  padding-right: 10px;
  border:'2px solid red';
`;

const ReviewScrollWrapper = styled.div`
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
  scrollbar-width: thin;
  padding-bottom: 100px;
`;

const PlaceReservCreatePage = () => {
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: addDays(new Date(), 1), key: 'selection' }]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [countPeople, setCountPeople] = useState(1);
  const [countPet, setCountPet] = useState(0);
  const [placeId, setPlaceId] = useState(null);
  const [tripPlanId, setTripPlanId] = useState(null);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [canWriteReview, setCanWriteReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [likeStates, setLikeStates] = useState({});
  // 리뷰 정렬
  const [sortKey, setSortKey] = useState('latest');
  // 상태 변수
  const [pendingAction, setPendingAction] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);


  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!router.isReady) return;

    const id = router.query.placeId;
    if (!id) return;

    const numericId = Number(id);
    setPlaceId(numericId);
  }, [router.isReady]);


  // 장소 정보 & 예약 날짜 불러오기
  useEffect(() => {
    const fetchPlaceAndDisabledDates = async () => {
      if (!router.isReady) return;

      const id = router.query.placeId;
      if (!id) return;
      setPlaceId(Number(id));

      try {
        const [placeRes, disabledDatesRes] = await Promise.all([
          axios.get(`/place/${id}`),
          axios.get(`/reserv/disabled-dates?placeId=${id}`),
        ]);

        setPlace(placeRes.data);

        const allDisabled = [];
        const today = new Date();
        disabledDatesRes.data.forEach(({ startDate, endDate }) => {
          if (parseISO(endDate) >= today) {
            const range = eachDayOfInterval({
              start: parseISO(startDate),
              end: parseISO(endDate),
            });
            allDisabled.push(...range);
          }
        });
        setDisabledDates(allDisabled);
      } catch (err) {
        setMessage('장소 정보를 불러오지 못했습니다.');
      }
    };

    fetchPlaceAndDisabledDates();
  }, [router.isReady]);

  // 장소 이미지
  const getFallbackImages = (items) => {
    const map = {};
    items.forEach(item => {
      const randomNum = Math.floor(Math.random() * 10) + 1;
      map[item.id] = `/image/other/randomImage/${randomNum}.jpg`;
    });
    return map;
  };
  const fallbackImages = useMemo(() => {
    if (!place) return {};
    return getFallbackImages([place, place]); // 배열로 감싸기
  }, [place]);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 로그인 + 즐겨찾기 + 리뷰 작성 여부
  useEffect(() => {
    const fetchUserAndPlaceMeta = async () => {
      try {
        const authRes = await axios.get('/api/auth/check', {
          withCredentials: true,
        });
        const userId = authRes.data.id;
        setMemberId(userId);
        setIsLoggedIn(true);
        
        const [canWriteRes, favoriteRes] = await Promise.all([
          axios.get(`/review/reserv/check`, {
            params: { memberId: userId, placeId },
          }),
          axios.get(`/favorite/check`, {
            params: {
              memberId: userId,
              targetId: placeId,
              targetType: 'PLACE',
            },
          }),
        ]);
        setCanWriteReview(canWriteRes.data === true);

        // 즐겨찾기 여부 설정
        setIsFavorite(
          favoriteRes.status === 200 &&
          Number(favoriteRes.data.targetId) === Number(placeId)
        );

        // 리뷰는 병렬 처리로 추가
        await fetchReviews(placeId, userId);
      } catch (err) {
        setIsLoggedIn(false);
        setCanWriteReview(false);
        setIsFavorite(false);
      }
    };

    if (placeId) fetchUserAndPlaceMeta();
  }, [placeId]);


  // 즐겨찾기 
  const toggleFavorite = async () => {
    if (!memberId || !placeId) return;

    const newFavorite = !isFavorite;   // 미리 상태 토글
    setIsFavorite(newFavorite);        // 즉시 UI 반영

    try {
      const payload = {
        targetId: placeId,
        targetType: 'PLACE',
        member: { id: memberId },
      };

      if (newFavorite) {
        await axios.post(`/favorite/add`, payload);
      } else {
        await axios.delete(`/favorite/delete`, { data: payload });
      }
      // 서버 재확인 생략 가능 (성공 응답만 받으면 됨)
    } catch (err) {
      setIsFavorite(!newFavorite); // 실패 시 원상복구
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////

  // 예약하기
  const executeReservation = async (resolvedMemberId) => {
    const peopleCount = Number(countPeople);
    const petCount = Number(countPet);

    if (peopleCount < 1 || peopleCount > 30) {
      alert('예약 인원은 1명 이상 30명 이하로 입력해주세요.');
      return;
    }

    if (petCount < 0 || petCount > 20) {
      alert('예약 반려 동물은 0마리 이상 20마리 이하로 입력해주세요.');
      return;
    }

    const expireAtDate = addDays(new Date(), 5);
    const payload = {
      startDate: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      endDate: format(dateRange[0].endDate, 'yyyy-MM-dd'),
      expireAt: format(expireAtDate, 'yyyy-MM-dd'),
      countPeople: peopleCount,
      countPet: petCount,
      member: { id: resolvedMemberId },
      place: { id: placeId },
      tripPlan: tripPlanId ? { id: tripPlanId } : null,
    };

    try {
      const res = await axios.post('/reserv', payload);
      alert('예약 성공! 🎉');
      router.push({
        pathname: '/pay/pay',
        query: {
          reservId: res.data.id,
          memberId: resolvedMemberId,
          countPeople,
          countPet,
          startDate: payload.startDate,
          endDate: payload.endDate,
          amount: 10000,
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data || '예약 생성 실패';
      alert(errorMsg);
      setMessage(errorMsg);
    }
  };

  // 예약 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn || !memberId) {
      setPendingAction(() => (idFromLogin) => executeReservation(idFromLogin));
      setShowLoginModal(true);
      return;
    }
    executeReservation(memberId); 
  };
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const authRes = await axios.get('/api/auth/check', {
          withCredentials: true,
        });
        const userId = authRes.data.id;
        setMemberId(userId);             
        setIsLoggedIn(true);

        const reservRes = await axios.get(`/review/reserv/check`, {
          params: { memberId: userId, placeId },
        });
        setCanWriteReview(reservRes.data === true);

        await fetchReviews(placeId, userId);
      } catch (err) {
        setIsLoggedIn(false);
        setCanWriteReview(false);
      }
    };

    if (placeId && isLoggedIn && memberId) {
      fetchAllData();
    }
  }, [placeId, isLoggedIn, memberId]);

  //////////////////////////////////////////////////////////////////////////
  // 리뷰 날씨
  const getWeatherImageFileName = (condition) => {
    switch (condition) {
      case '흐림':
        return 'cloudy.png';
      case '비':
        return 'rain.png';
      case '눈':
        return 'snow.png';
      case '구름많음':
        return 'mostly-cloudy.png';
      case '맑음':
        return 'sun.png';
    }
  };


  // 리뷰
  const fetchReviews = async (placeId, memberId, sort = 'latest', page = 0) => {
    if (!placeId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/review/place/${placeId}`, {
        params: {
          sort,
          page,
          size: pageSize,
        },
      });
      const { content, totalElements, totalPages, avgRating } = res.data;

      setReviews(content);
      setTotalElements(totalElements);
      setAvgRating(avgRating);
      setReviewCount(totalElements); // 전체 리뷰 수로 수정

      const newLikeStates = {};
      for (let review of content) {
        const likePromise = memberId
          ? axios.get(`/review/${review.id}/like/marked`, {
              params: { memberId },
            })
          : Promise.resolve({ data: false });

        const countPromise = axios.get(`/review/${review.id}/like/count`);

        const [likedRes, countRes] = await Promise.all([likePromise, countPromise]);

        newLikeStates[review.id] = {
          liked: likedRes.data,
          count: countRes.data,
        };
      }
      setLikeStates(newLikeStates);
    } catch (err) {
      console.error('리뷰 불러오기 실패:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (placeId) {
      fetchReviews(placeId, memberId || null, sortKey, currentPage);
    }
  }, [placeId, memberId, sortKey, currentPage]);

  /////////////////////////////////////////////////////
  // 좋아요 
  const toggleLike = async (reviewId) => {
    if (!memberId) {
      message.warning('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      const liked = likeStates[reviewId]?.liked;
      const url = `/review/${reviewId}/like`;

      if (liked) {
        await axios.delete(url, {
          params: { memberId },
        });
      } else {
        await axios.post(url, null, {
          params: { memberId },
        });
      }

      // 좋아요 상태 다시 가져오기
      const [likedRes, countRes] = await Promise.all([
        axios.get(`${url}/marked`, { params: { memberId } }),
        axios.get(`${url}/count`),
      ]);

      setLikeStates((prev) => ({
        ...prev,
        [reviewId]: {
          liked: likedRes.data,
          count: countRes.data,
        },
      }));
    } catch (err) {
      message.error('좋아요 처리에 실패했습니다.');
    }
  };
  /////////////////////////////////////////////////////////////////////////////

  //로그인
  const handleLoginSuccess = async () => {
    setShowLoginModal(false);

    try {
      const res = await axios.get('/api/auth/check', {
        withCredentials: true,
      });

      const id = res.data.id;
      setMemberId(id);
      setIsLoggedIn(true);

      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);

        action(id); 
      }
    } catch (err) {
    }
  };


  return (
    <AppLayout>
      {(loading || !place) && <PetassistantLoading reservState="DEFAULT" />}
      <div style={{ width: '100%', height: '50px' }} />
      {!place ? (
        <Container>
          <Title>장소 정보를 불러오는 중입니다...</Title>
        </Container>
      ) : (
        <Container>
          <Title>{place.name}</Title>
          <Layout>
            <ImageSection>
              <ScrollContainer>
                <ImageWrapper>
                  <img
                    alt="장소 이미지"
                    className="place-image"
                    src={place.imageUrl && place.imageUrl.length > 0 ? place.imageUrl : fallbackImages[place.id]}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/other/tempImage.jpg";
                    }}
                  />
                  {isFavorite !== null && (
                    <img
                      src={`${isFavorite
                        ? '/image/other/favorite/favorite.png'
                        : '/image/other/favorite/notFavorite.png'}?t=${new Date().getTime()}`}
                      alt="즐겨 찾기"
                      className="favorite-icon"
                      onClick={toggleFavorite}
                    />
                  )}
                </ImageWrapper>
                <p style={{ padding: '10px' }}>{place.description || <div>낯선 길 위를 걷고 있을 때, 가장 큰 위로는 곁에 있는 존재에서 옵니다.
                  이곳은 그런 위로가 자연스럽게 스며드는 공간입니다.
                  당신과 반려동물이 오랫동안 간직하고 싶은 추억을 만들어보세요.</div>}</p>
                <div style={{ marginBottom: '5px' }}><img src='/image/other/location.png' alt='장소' /> &nbsp; {place.region}</div>
                <div style={{ marginBottom: '5px' }}><img src='/image/other/call-calling.png' alt='전화번호' /> &nbsp; {place.phone || '010-1234-1234'}</div>
                <div style={{ marginBottom: '5px' }}><img src='/image/other/clock.png' alt='시간' /> &nbsp; {place.openHours || '홈페이지 참조'}</div>
                <div style={{ marginBottom: '5px' }}><img src='/image/other/verify.png' alt='장소' /> &nbsp; {place.parking || 불가능}</div>
              </ScrollContainer>
            </ImageSection>
            <TabsSection >
              {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
              <div>
                <Tabs defaultActiveKey="reserv" centered tabBarGutter={80} style={{ marginTop: '10px', textAlign: 'center', border: '0px solid red' }}>
                  <TabPane tab="예약" key="reserv" style={{ border: '0px solid red' }}  >
                    <Form onSubmit={handleSubmit} style={{ textAlign: 'center', alignItems: 'center' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ textAlign: 'center', border: '0px solid red', width: '100%', flex: '1' }}>
                          <Label></Label>
                          <DateRange
                            editableDateInputs
                            onChange={item => setDateRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            minDate={new Date()}
                            disabledDates={disabledDates}
                            style={{ width: '100%' }}
                          />
                          <ExpireText>⏳ 만료일: <strong>{format(addDays(new Date(), 5), 'yyyy-MM-dd')}</strong></ExpireText>
                        </div>
                        <div>
                          <div style={{ margin: '40px' }}>
                            <Label>인원 수</Label>
                            <Input type="number" min="1" value={countPeople} onChange={(e) => setCountPeople(e.target.value)} />
                          </div>
                          <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                            <Label>반려동물 수</Label>
                            <Input type="number" min="0" value={countPet} onChange={(e) => setCountPet(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <SubmitButton type="submit" style={{ width: '60%', textAlign: 'center', marginTop: '50px' }}> 예약 하기</SubmitButton>
                      {message && <ErrorMsg>{message}</ErrorMsg>}
                    </Form>
                  </TabPane>
                  <TabPane tab="리뷰" key="review">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between', marginRight: '10px' }}>
                        <div style={{ border: 'none' }}>
                          <span style={{ marginLeft: 8 }}>{avgRating}</span>
                          <span style={{ marginLeft: 12, color: '#888' }}>리뷰 {reviewCount}개</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
                          <Button
                            type="text"
                            onClick={() => {
                              setSortKey('latest');
                              setCurrentPage(0);
                            }}
                            style={{
                              borderBottom: sortKey === 'latest' ? '2px solid black' : 'none'
                            }}
                          >
                            최신순으로
                          </Button>

                          <Button
                            type="text"
                            onClick={() => {
                              setSortKey('likes');
                              setCurrentPage(0);
                            }}
                            style={{
                              borderBottom: sortKey === 'likes' ? '2px solid black' : 'none'
                            }}
                          >
                            추천순으로
                          </Button>
                        </div>
                        <div style={{ border: 'none' }}>
                        </div>
                      </div>
                    </div>
                    {loading ? (
                      <Spin tip="리뷰 불러오는 중..." />
                    ) : (
                      <ReviewScrollWrapper>
                        {reviews.map(r => (
                          <div key={r.id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar size={48} />
                                <div style={{ marginLeft: 12 }}>
                                  <div style={{ fontWeight: 600 }}>{r.member.nickname}</div>
                                  <Rate value={r.rating} disabled style={{ fontSize: 14, margin: '4px 0' }} />
                                  <div style={{ fontSize: 12, color: '#888' }}>{r.createdAt?.substring(0, 10)}</div>
                                </div>
                              </div>
                              <div style={{ fontSize: 24 }}>
                                {['흐림', '비', '눈', '구름많음', '맑음'].includes(r.weatherCondition) && (
                                  <img
                                    src={`/image/weather/${getWeatherImageFileName(r.weatherCondition)}`}
                                    alt={r.weatherCondition}
                                    style={{ width: 50, height: 50 }}
                                  />
                                )}
                                {r.weatherCondition === '알 수 없음' && <QuestionOutlined style={{ color: '#aaa' }} />}
                              </div>
                            </div>

                            <div style={{ marginTop: 12 }}>{r.content}</div>
                            {r.reviewImages?.length > 0 && (
                              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {r.reviewImages.map((img) => (
                                  <img
                                    key={img.id}
                                    src={`/upload/reviews/${img.imageUrl}`}
                                    alt={img.originalFileName}
                                    style={{
                                      width: 120,
                                      height: 120,
                                      borderRadius: 8,
                                      objectFit: 'cover',
                                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/image/other/tempImage.jpg';
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            <Button
                              block
                              type={likeStates[r.id]?.liked ? 'primary' : 'default'}
                              onClick={() => toggleLike(r.id)}
                              style={{ marginTop: 12 }}
                            >
                              👍 도움이 돼요 {likeStates[r.id]?.count ?? 0}
                            </Button>
                          </div>
                        ))}
                        <Pagination
                          current={currentPage + 1}
                          pageSize={10}
                          total={totalElements} // <= 이 값이 0이면 페이지 버튼 안 나옴
                          onChange={(page) => setCurrentPage(page - 1)}
                          style={{ textAlign: 'center', marginTop: 24 }}
                          showLessItems
                          showSizeChanger={false}
                        />
                      </ReviewScrollWrapper>
                    )}
                  </TabPane>
                </Tabs>
              </div>
            </TabsSection>
          </Layout>
          <PetAssistant />
          {showLoginModal && <LoginFormModal
            onLoginSuccess={handleLoginSuccess}
            onToggleForm={() => setShowLoginModal(false)}
          />}
        </Container>
      )}
    </AppLayout >
  );
};

export default PlaceReservCreatePage;
