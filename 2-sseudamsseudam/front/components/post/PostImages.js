import React, { useState } from 'react';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const PostImages = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null; // 이미지가 없으면 아무것도 렌더링 안 함
  }

  const totalImages = images.length;

  const onClickLeft = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {return 0;}
      return prev - 1;
    });
  };
  const onClickRight = () => {
    setCurrentIndex((prev) => {
      if (prev === totalImages - 1) {return prev;}
      return prev + 1;
    });
  };

  // 이미지가 1개일 때
  if (totalImages === 1 && images[0]?.src) {
    return (
      <>
        <img role="presentation" src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} style={{ width: '100%' }} />
      </>
    );
  }

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 600 }}>
        {/* 왼쪽 화살표 */}
        {totalImages > 1 && currentIndex > 0 && (
          <CaretLeftOutlined
            onClick={onClickLeft}
            style={{
              position: 'absolute',
              top: '50%',
              left: 10,
              transform: 'translateY(-50%)',
              fontSize: 30,
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
              userSelect: 'none',
            }}
          />
        )}

        {/* 이미지 */}
        <img
          role="presentation"
          src={`http://localhost:3065/${images[currentIndex].src}`}
          alt={images[currentIndex].src}
          style={{ width: '100%', display: 'block' }}
        />

        {/* 오른쪽 화살표 */}
        {totalImages > 1 && currentIndex < totalImages - 1 && (
          <CaretRightOutlined
            onClick={onClickRight}
            style={{
              position: 'absolute',
              top: '50%',
              right: 10,
              transform: 'translateY(-50%)',
              fontSize: 30,
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
              userSelect: 'none',
            }}
          />
        )}

        {/* 아래 더보기 텍스트 */}
        {totalImages > 1 && (
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 14, color: '#555' }}>
            {totalImages - 1} 개의 사진 더보기
          </div>
        )}
      </div>
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ).isRequired,
};

export default PostImages;
