import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

const PLACEHOLDER_IMAGE = '/images/question-mark.png';

const MyBadgeSection = ({ memberId }) => {
  const [allBadges, setAllBadges] = useState([]);
  const [ownedBadges, setOwnedBadges] = useState([]);
  const [representativeBadge, setRepresentativeBadge] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [allRes, ownedRes] = await Promise.all([
          axios.get('/mypage/badges'),
          axios.get(`/mypage/badges/${memberId}`),
        ]);

        setAllBadges(allRes.data);
        setOwnedBadges(ownedRes.data);

        const firstOwned = allRes.data.find((badge) =>
          ownedRes.data.some((owned) => owned.id === badge.id)
        );
        setRepresentativeBadge(firstOwned || null);
      } catch (err) {
        console.error('뱃지 로딩 실패', err);
      }
    };

    fetchBadges();
  }, [memberId]);

  const isOwned = (badgeId) =>
    ownedBadges.some((owned) => owned.id === badgeId);

  const getOwnedInfo = (badgeId) =>
    ownedBadges.find((owned) => owned.id === badgeId);

  const getNextBadgeWeightGap = (currentBadgeId) => {
    const current = getOwnedInfo(currentBadgeId);
    const nextBadge = allBadges.find((b) => b.id === currentBadgeId + 1);
    if (!nextBadge) return null;

    const diff = nextBadge.weight - current.weight;
    return diff > 0 ? diff : 0;
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* 대표 뱃지 */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {representativeBadge ? (
          <>
            <img
              src={`/upload/badge/${representativeBadge.imageUrl}`}
              alt="대표 뱃지"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #888',
              }}
            />
            <div style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '18px' }}>
              {representativeBadge.name}
            </div>
            <div style={{ fontSize: '14px', color: '#777' }}>
              {representativeBadge.description}
            </div>
          </>
        ) : (
          <p>대표 뱃지를 선택해주세요.</p>
        )}
      </div>

      {/* 전체 뱃지 리스트 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {allBadges.map((badge) => {
          const owned = isOwned(badge.id);
          const ownedInfo = getOwnedInfo(badge.id);
          const nextGap = owned ? getNextBadgeWeightGap(badge.id) : null;

          return (
            <Tooltip
              key={badge.id}
              title={
                owned ? (
                  nextGap !== null ? (
                    <div>
                      {badge.name} : {ownedInfo.weight}g
                      <br />
                      다음 단계까지 {nextGap}g 남았어요.
                    </div>
                  ) : (
                    <div>
                      {badge.name} : {ownedInfo.weight}g
                      <br />
                      최고 등급 뱃지를 획득하셨습니다 🎉
                    </div>
                  )
                ) : (
                  '???'
                )
              }
            >
              <div
                onClick={() => owned && setRepresentativeBadge(badge)}
                style={{
                  textAlign: 'center',
                  cursor: owned ? 'pointer' : 'default',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 8px',
                    backgroundColor: '#f2f2f2',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {owned ? (
                    <img
                      src={`/upload/badge/${badge.imageUrl}`}
                      alt={badge.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <QuestionOutlined style={{ fontSize: '32px', color: '#888' }} />
                  )}
                </div>

                <div style={{ fontWeight: 'bold' }}>
                  {owned ? badge.name : '???'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {owned ? badge.description : ''}
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default MyBadgeSection;
