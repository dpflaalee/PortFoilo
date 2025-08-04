import React, { useEffect, useState } from 'react';
import { getPassportWithSeals } from '@/api/passportApi';
import ReviewSelectorModal from './ReviewSelectorModal';
import axios from 'axios';

const PassportDetailModal = ({ passport, onClose, memberId }) => {
  const [fullPassport, setFullPassport] = useState(null);
  const [showReviewSelector, setShowReviewSelector] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    axios
      .get('/api/auth/check', { withCredentials: true })
      .then((res) => {
        if (res.status === 200 && res.data.nickname) { setNickname(res.data.nickname); }
      })
      .catch((err) => { console.error('닉네임 가져오기 실패:', err); setNickname(''); });
  }, []);

  useEffect(() => {
    if (passport) {
      getPassportWithSeals(passport.id).then((res) => { setFullPassport(res.data); console.log(res.data); });

    }
  }, [passport]);

  if (!fullPassport) return null;

  const { petName, species, petAge, petGender, passNum, imageUrl, passportSeals } = fullPassport;

  const refreshSeals = () => {
    getPassportWithSeals(passport.id).then((res) => setFullPassport(res.data));
  };


  return (<>
    <style>{`
        .passport-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .passport-modal {
          background: #fff;
          width: 572px;
          height: 800px;
          max-width: 90%;
          border-radius: 10px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          padding: 24px 72px;
        }

        .passport-header img {
          width: 150px;
          height: 190px;
          object-fit: cover;
          border-radius: 3px;
        }

        .stamp-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }

        .stamp-list img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 6px;
        }
      `}</style>

    <div className="passport-overlay">

      <div className="passport-modal">
        <h3 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}> {petName}의 여권</h3>

        <div style={{ border: '5px solid #384974', borderRadius: '10px' }}><div style={{ borderRight: '5px solid #dedede', borderRadius: '8px' }}>

          <div style={{ border: '1px solid #fff', height: '260px' }}>
            {passportSeals.length > 0 ? (
              <div className="stamp-list">
                {passportSeals.map((seal) => (
                  <a key={seal.id} href={`/tripPlan/${seal.review?.targetId}`}>   <img src={seal.seal?.imageUrl?.startsWith('http') ? seal.seal.imageUrl : seal.seal?.imageUrl} alt={seal.seal?.name || '도장'} /> </a>
                ))}
              </div>
            ) : (
              <p>아직 도장이 없습니다.</p>
            )}
          </div>

          <div style={{ borderTop: '2px solid #ccc', padding: '12px 16px' }}>
            <h1 style={{ fontSize: '16px', textAlign: 'center', fontWeight: 'bold', marginBottom: '12px' }}>PET PASSPORT</h1>
            <div style={{ display: 'flex' }}>
              <div className="passport-header" style={{ marginRight: 18 }}>
                <img
                  src={imageUrl?.startsWith('http') ? imageUrl : imageUrl} alt={petName}
                /> </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '100px', marginRight: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#a9a9a9' }}>소속</h3>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{nickname || '익명'}</p>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#a9a9a9' }}>이름</h3>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{petName}</p>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#a9a9a9' }}>나이</h3>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{petAge}살</p>
                  </div>
                </div>

                <div style={{ width: '140px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#a9a9a9' }}>여권번호</h3>
                    <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{passNum}</p>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#a9a9a9' }}>종</h3>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{species}</p>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#a9a9a9' }}>성별</h3>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{petGender}</p>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ textAlign: 'center', letterSpacing: '0.85em', color: '#ccc', margin: '12px 0 20px' }}>CutenessSavesTheWorld</p>
          </div>

        </div></div>

        <button style={{ marginTop: '24px', padding: '10px', fontWeight: 'bold', color: '#fff', backgroundColor: '#000', border: 'none', borderRadius: '3px', width: '100%' }}
          onClick={() => setShowReviewSelector(true)}>도장 추가하기</button>
        {showReviewSelector && (
          <ReviewSelectorModal memberId={memberId} passportId={passport.id} onClose={() => setShowReviewSelector(false)} onSaved={refreshSeals} // 도장 추가 후 여권 상세 다시 로딩
          />
        )}
        <button style={{ marginTop: '10px', padding: '10px', fontWeight: 'bold', color: '#000', backgroundColor: '#fff', border: '2px solid #000', borderRadius: '3px', width: '100%' }}
          onClick={onClose}>닫기</button>

      </div>


    </div>
  </>);
};

export default PassportDetailModal;
