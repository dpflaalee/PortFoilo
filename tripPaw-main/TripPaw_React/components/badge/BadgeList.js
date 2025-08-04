// components/admin/BadgeList.js
import React from 'react';
import { Card, Button, Row, Col, Popconfirm, message } from 'antd';
import axios from 'axios';

const IMAGE_BASE_URL = '/upload/badge/';

const BadgeList = ({ badges, onEdit, onDeleteSuccess }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/badge/${id}`);
      message.success('삭제 완료');
      onDeleteSuccess();
    } catch (err) {
      console.error(err);
      message.error('삭제 실패');
    }
  };

  return (
    <Row gutter={[16, 24]}>
      {badges.map((badge) => (
        <Col key={badge.id}>
          <Card
            cover={
              <img
                alt={badge.name}
                src={`${IMAGE_BASE_URL}${badge.imageUrl}`}
                style={{ height: 120, objectFit: 'cover' }}
              />
            }
            style={{ width: 160, textAlign: 'center' }}
          >
            <div style={{ marginBottom: 8 }}>{badge.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{badge.description}</div>
            <Button size="small" onClick={() => onEdit(badge)} style={{ marginTop: 8 }}>
              수정하기
            </Button>
            <Popconfirm
              title="정말 삭제하시겠습니까?"
              onConfirm={() => handleDelete(badge.id)}
              okText="네"
              cancelText="아니오"
            >
              <Button size="small" danger style={{ marginTop: 4 }}>
                삭제하기
              </Button>
            </Popconfirm>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BadgeList;
