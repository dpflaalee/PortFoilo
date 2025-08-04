import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPrize,
  modifyPrize,
  removePrize,
  loadPrizes,
} from '@/reducers/prize';
import PrizeForm from '@/components/prize/PrizeForm';
import PrizeList from '@/components/prize/PrizeList';
import axios from 'axios';


const { Title } = Typography;



const PrizeManage = () => {
  const dispatch = useDispatch();

  // 카테고리 데이터 불러오기
  const [animalCategories, setCategoryOptions] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/category');
        const animalCategories = res.data.filter(category => category.isAnimal);
        setCategoryOptions(animalCategories);
      } catch (err) { message.error('카테고리를 불러오지 못했습니다.'); }
    };
    fetchCategories();
  }, []);

  // Redux state
  const { prizes, addPrizeDone, modifyPrizeDone, removePrizeDone } = useSelector(
    (state) => state.prize
  );

  const [formVisible, setFormVisible] = useState(false);
  const [editingPrize, setEditingPrize] = useState(null);

  useEffect(() => {
    dispatch(loadPrizes());
  }, [dispatch]);

  // 상품 추가/수정 후 모달 닫기
  useEffect(() => {
    if (addPrizeDone || modifyPrizeDone) {
      setFormVisible(false);
    }
  }, [addPrizeDone, modifyPrizeDone]);

  const handleAddClick = () => {
    setEditingPrize(null);
    setFormVisible(true);
  };

  const handleSubmit = (prize) => {
    if (editingPrize) {
      dispatch(modifyPrize(prize));
    } else {
      dispatch(addPrize(prize));
    }
  };

  const handleDelete = (id) => {
    dispatch(removePrize(id));
  };

  const handleEdit = (prize) => {
    setEditingPrize(prize);
    setFormVisible(true);
  };

  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={4}>상품 관리</Title>
          </Col>
          <Col>
            <Button type="primary" onClick={handleAddClick}>
              + 상품 추가
            </Button>
          </Col>
        </Row>
      </Card>

      <PrizeList
        prizes={prizes}
        categories={animalCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PrizeForm
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        editingPrize={editingPrize}
        categories={animalCategories}
      />
    </>
  );
};

export default PrizeManage;
