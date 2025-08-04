import React from 'react';

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px 32px',
    width: '500px',
    textAlign: 'center',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
    gap: '16px',
};

const cancelButtonStyle = {
    padding: '10px 24px',
    border: '1px solid black',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
};

const confirmButtonStyle = {
    padding: '10px 24px',
    backgroundColor: 'black',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const PublicConfirmModal = ({ onCancel, onConfirm }) => {
    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>공개로 전환하기</h2>
                <p style={{ marginBottom: '8px' }}>
                    한 번 공개로 전환된 여행은 다시 비공개로 전환할 수 없습니다.
                </p>
                <p style={{ marginBottom: '8px' }}>
                    영구삭제 또한 불가능합니다.
                </p>
                <p style={{ marginBottom: '24px' }}>
                    다른 사람이 내 여행을 볼 수 있도록 전환하시겠습니까?
                </p>
                <p style={{ fontSize: '13px', color: '#666' }}>
                    ※ 민감한 개인정보는 포함하지 않습니다.
                </p>

                <div style={buttonContainerStyle}>
                    <button style={cancelButtonStyle} onClick={onCancel}>
                        취소
                    </button>
                    <button style={confirmButtonStyle} onClick={onConfirm}>
                        공개하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicConfirmModal;
