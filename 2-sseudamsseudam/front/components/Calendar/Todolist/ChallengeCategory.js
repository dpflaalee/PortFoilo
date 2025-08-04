import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Avatar, Select, Row, Col, Space, Modal, Checkbox, Card, Divider, Dropdown, Tag } from 'antd';
import { UserOutlined, UploadOutlined, EnvironmentOutlined, DownOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

// '챌린지' 판별
const isChallengeTitle = (title) => {
  return typeof title === 'string' && title.includes('챌린지');
};

const ChallengeCategory = ({ groupId, isGroup = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openScope, setOpenScope] = useState('public');
  const [isChallenge, setIsChallenge] = useState(false);
  const [calendarTitles, setCalendarTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [tempCategory, setTempCategory] = useState(null);

  // const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post)
  const addPostLoading = false;
  const addPostDone = false;

  const [text, setText] = useState('');
  const onChangeText = (e) => setText(e.target.value);
  const handleClearCategory = () => {
    setSelectedCategory(null);
    setIsChallenge(false);
  };

  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get('/api/schedule/calendars');
        setCalendarTitles(response.data);
      } catch (error) {      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmitForm = useCallback(() => {
    if (!text || !text.trim()) return alert('게시글을 작성하세요.');

    const formData = new FormData();
    imagePaths.forEach((i) => formData.append('image', i));
    formData.append('content', text);
    formData.append('openScope', openScope);
    if (isGroup && groupId) formData.append('groupId', groupId);

  }, [text, imagePaths, groupId]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
  // imageInput.current.click();
  alert('사진 기능 테스트');
}, []);

  const onRemoveImage = useCallback((index) => () => {
    setImagePaths((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const goToMap = () => { alert("지도 페이지로 이동 (테스트용)");  };

  // 드롭다운 메뉴 items
  const calendarDropdownItems = calendarTitles.map((item) => ({
    key: String(item.id),
    label: item.title,
    icon: isChallengeTitle(item.title)
      ? <FireOutlined style={{ color: '#fa5e37' }} />
      : <UserOutlined />,
  }));
  
  const handleMenuClick = ({ key }) => {
    const selected = calendarTitles.find(item => String(item.id) === key);
    if (selected) {
      setTempCategory(selected.title);
    }
  };

  const handleModalOk = () => {
    if (tempCategory) {
      setSelectedCategory(tempCategory);
      setIsChallenge(isChallengeTitle(tempCategory));
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get('/calendar');
        setCalendarTitles(response.data);
      } catch (error) { } finally { setLoading(false); }
    };
    fetchTitles();
  }, []);

  return (
    <Card style={{ margin: '3%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Form layout="vertical" encType="multipart/form-data" onFinish={onSubmitForm}>
        <Form.Item>
          <Row align="middle" justify="start" gutter={16} wrap={false}>
            <Col>
              <Avatar size="large" icon={<UserOutlined />} />
            </Col>
            <Col>
              <Space>
                <Select
                  value={openScope}
                  onChange={(value) => setOpenScope(value)}
                  style={{ width: 120 }}
                >
                  <Option value="public">전체 공개</Option>
                  <Option value="private">나만 보기</Option>
                  <Option value="follower">팔로워 공개</Option>
                  <Option value="group">그룹 공개</Option>
                </Select>
                <Button onClick={() => setIsModalOpen(true)}>카테고리 및 챌린지</Button>
              </Space>
              {selectedCategory && (
                <div style={{ marginTop: '8px' }}>
                  <Tag closable onClose={handleClearCategory}>
                    {selectedCategory}
                  </Tag>
                </div>
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <TextArea
            placeholder="무슨 일이 있었나요?"
            maxLength={300}
            value={text}
            onChange={onChangeText}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>
        <Form.Item>
          <Row justify="space-between" align="middle" style={{ flexWrap: 'wrap' }}>
            <Col>
              <Space>
                <Button icon={<UploadOutlined />} onClick={onClickImageUpload}>
                  사진 업로드
                </Button>
                <Button icon={<EnvironmentOutlined />} onClick={goToMap}>
                  지도
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button type="primary" htmlType="submit" loading={addPostLoading}>
                  POST
                </Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>

        {Array.isArray(imagePaths) && imagePaths.length > 0 && (
          <>
            <Divider>업로드된 이미지</Divider>
            <Row gutter={[16, 16]}>
              {imagePaths.map((v, i) => (
                <Col key={v}>
                  <Card
                    cover={<img alt={`업로드된 이미지 ${i + 1}`} src={`http://localhost:3065/${v}`} style={{ objectFit: 'cover', height: 180 }} />}
                    actions={[<Button type="link" danger onClick={onRemoveImage(i)}>제거</Button>]}
                    style={{ width: 200 }}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Form>

      <Modal
        title="카테고리 선택"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="확인"
        cancelText="취소"
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <Row gutter={[0, 8]}>
            <Col span={12}><Checkbox value="dog">강아지</Checkbox></Col>
            <Col span={12}><Checkbox value="cat">고양이</Checkbox></Col>
            <Col span={12}><Checkbox value="other">기타</Checkbox></Col>
            <Col span={24}>
              <Dropdown
                menu={{ items: calendarDropdownItems, onClick: handleMenuClick }}
              >
                <Button>
                  <Space>
                    {(tempCategory || selectedCategory || '카테고리 선택')} <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Checkbox.Group>
      </Modal>
    </Card>
  );
};

export default ChallengeCategory;
