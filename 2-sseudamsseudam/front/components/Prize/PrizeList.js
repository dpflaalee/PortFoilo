import React from 'react';
import { Card, Row, Col, Button, Popconfirm, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

const PrizeList = ({ prizes, onEdit, onDelete }) => {
  return (
    <Card title="등록된 상품 리스트">
      <Row gutter={[0, 16]}>
        {prizes.map((prize) => (
          <Col span={24} key={prize.id}>
            <Card
              type="inner"
              title={`${prize.category?.content || '알 수 없음'} - ${prize.content}`}
              extra={
                <>
                  <Button
                    type="link"
                    onClick={() => onEdit(prize)}
                    style={{ marginRight: 8 }}
                  >
                    수정
                  </Button>
                  <Popconfirm
                    title="정말 삭제하시겠습니까?"
                    onConfirm={() => onDelete(prize.id)}
                  >
                    <Button type="link" danger>
                      삭제
                    </Button>
                  </Popconfirm>
                </>
              }
            >
              <Text>유효기간: {moment(prize.dueAt).format('YYYY-MM-DD')}</Text>
              <br />
              <Text>수량: {prize.quantity}</Text>
              <br />
              <Text>확률: {prize.probability}%</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default PrizeList;
