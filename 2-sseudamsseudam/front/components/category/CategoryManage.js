import React, { useState, useEffect } from 'react';
import { Button, Input, List, Space, Modal, Form, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_CATEGORY_REQUEST, LOAD_CATEGORIES_REQUEST, EDIT_CATEGORY_REQUEST } from '@/reducers/category';
import { Tabs } from 'antd';

const CategoryManage = () => {
    const { categories } = useSelector(state => state.category);
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [isAnimal, setIsAnimal] = useState(false); // 추가 모달 체크박스 상태
    const [editCategory, setEditCategory] = useState(null);

    const animalCategories = categories.filter(category => category.isAnimal);
    const generalCategories = categories.filter(category => !category.isAnimal);

    useEffect(() => {
        dispatch({ type: LOAD_CATEGORIES_REQUEST });
    }, [dispatch]);

    // 카테고리 추가 함수
    const handleAddCategory = () => {
        if (newCategory) {
            const categoryData = { content: newCategory, isAnimal };
            dispatch({ type: ADD_CATEGORY_REQUEST, data: categoryData });

            setNewCategory('');
            setIsAnimal(false); // 모달 닫힐 때 초기화
            setIsModalVisible(false);
            message.success('카테고리가 추가되었습니다.');
        }
    };

    // 수정 모달 열기
    const showEditModal = (category) => {
        setEditCategory(category);
        setEditModalVisible(true);
    };

    // 수정 완료 함수
    const handleEditCategory = () => {
        if (editCategory) {
            const editCategoryData = { id: editCategory.id, content: editCategory.content, isAnimal: editCategory.isAnimal };
            dispatch({
                type: EDIT_CATEGORY_REQUEST,
                data: editCategoryData,
            });
            message.success('카테고리가 수정되었습니다.');
            setEditModalVisible(false);

            setTimeout(() => {
                dispatch({ type: LOAD_CATEGORIES_REQUEST });
            }, 500);
        }
    };

    useEffect(() => {
    }, [categories]);


    return (
        <div style={{ padding: '20px' }}>
            <h2>카테고리 관리</h2>
            {/* 탭 UI 추가 */}
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="동물 카테고리" key="1">
                    <List
                        bordered
                        dataSource={animalCategories}
                        renderItem={(item) => (
                            <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.content}</span>
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => showEditModal(item)}
                                />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="챌린지" key="2">
                    <List
                        bordered
                        dataSource={generalCategories}
                        renderItem={(item) => (
                            <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.content}</span>
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => showEditModal(item)}
                                />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane>
            </Tabs>

            {/* 카테고리 추가 버튼 */}
            <Space style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    카테고리 추가
                </Button>
            </Space>

            {/* 카테고리 추가 Modal */}
            <Modal
                title="새 카테고리 추가"
                open={isModalVisible}
                onOk={handleAddCategory}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form>
                    <Form.Item label="카테고리명">
                        <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="카테고리 이름을 입력하세요"
                        />
                    </Form.Item>
                    <Form.Item>
                        <label>
                            <input
                                type="checkbox"
                                checked={isAnimal}
                                onChange={(e) => setIsAnimal(e.target.checked)}
                            />
                            동물 관련 카테고리
                        </label>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 카테고리 수정 Modal */}
            <Modal
                title="카테고리 수정"
                open={editModalVisible}
                onOk={handleEditCategory}
                onCancel={() => setEditModalVisible(false)}
            >
                <Form>
                    <Form.Item label="카테고리명">
                        <Input
                            value={editCategory?.content}
                            onChange={(e) => setEditCategory({ ...editCategory, content: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item>
                        <label>
                            <input
                                type="checkbox"
                                checked={editCategory?.isAnimal}
                                onChange={(e) => setEditCategory({ ...editCategory, isAnimal: e.target.checked })}
                            />
                            동물 관련 카테고리
                        </label>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManage;
