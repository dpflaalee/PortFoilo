import React from 'react';
import { Card, Button } from 'antd';
import { DeleteOutlined, QqOutlined } from '@ant-design/icons';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';

import DummyComment from './DummyComment';
import ComplainPost from './ComplainPost';
import ComplainProfile from './ComplainProfile';

import { useDispatch } from 'react-redux';
import { IS_BLIND_REQUEST } from '@/reducers/complain';

const ComplainCard = ({ reports }) => {
    const dispatch = useDispatch();
    if (!reports || reports.length === 0) return null;

    const report = reports[0];
    const { targetId, targetType, targetObject, isBlind, createdAt } = report;

    const handleBlind = () => {
        dispatch({
            type: IS_BLIND_REQUEST,
            data: { targetId },
        });
    };

    const renderByType = () => {
        if (!targetObject) return <div>불러오는 중입니다...</div>;

        switch (targetType) {
            case TARGET_TYPE.POST:
                return (
                    <>
                        <div style={{ fontWeight: 'bold' }}>
                            총 {reports.length}명이 게시글을 신고했습니다.
                        </div>
                        <div style={{ padding: '8px', backgroundColor: '#f9f9f9', marginTop: 8 }}>
                            <ComplainPost post={targetObject} />
                        </div>
                    </>
                );

            case TARGET_TYPE.COMMENT:
                return (
                    <>
                        <div style={{ fontWeight: 'bold' }}>
                            총 {reports.length}명이 댓글을 신고했습니다.
                        </div>
                        <div style={{ padding: '8px', backgroundColor: '#f0f0f0', marginTop: 8 }}>
                            <DummyComment comment={targetObject} />
                        </div>
                    </>
                );

            case TARGET_TYPE.USER:
                return (
                    <>
                        <div style={{ fontWeight: 'bold' }}>
                            총 {reports.length}명이 유저 ' {targetObject?.nickname} ' 신고했습니다.
                        </div>
                        <div style={{ padding: '8px', backgroundColor: '#fff7e6', marginTop: 8 }}>
                            <ComplainProfile postUserId={targetObject.id} />
                        </div>
                    </>
                );

            default:
                return <div>알 수 없는 신고 유형입니다.</div>;
        }
    };

    return (
        <Card
            style={{ marginBottom: 24 }}
            title={<span style={{ color: '#888' }}>{createdAt}</span>}
            extra={
                isBlind ? (
                    <Button icon={<QqOutlined />}>처리 완료됨</Button>
                ) : (
                    <Button danger icon={<DeleteOutlined />} onClick={handleBlind}>
                        내용 삭제하기
                    </Button>
                )
            }
        >
            {renderByType()}

            <div style={{ marginTop: 16 }}>
                {reports.map((r, idx) => (
                    <div key={idx} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                        <strong>{r.Reporter?.nickname ?? '알수 없음'}</strong>의 신고 이유: {r.reason}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ComplainCard;
