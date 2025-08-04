import React, { useEffect, useState } from 'react';
import { Divider, DatePicker, Input, Form, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const ChallengeChange = ({ challenge, onSubmit }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3065/user', { withCredentials: true });
        if (res.data && Number(res.data.isAdmin) === 1) {
          setIsAdmin(true);
        } else {
          if (isChecking) {
            alert('권한이 없습니다.');
            router.replace('/challenge');
          }
        }
      } catch (error) {
        message.error('정보 불러오기에 실패했습니다.');
        router.replace('/admin/manage');
      } finally {
        setIsChecking(false);
      }
    };
  if (isChecking) { fetchUser(); }}, [isChecking, router]);

  useEffect(() => {
    if (challenge) {
      form.setFieldsValue({
        title: challenge.title,
        content: challenge.content,
        range: [dayjs(challenge.startDate), dayjs(challenge.endDate)],
      });
    }
  }, [challenge, form]);

  const handleFinish = (values) => {
    const [startDate, endDate] = values.range;
    const payload = {
      title: values.title,
      content: values.content,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    onSubmit(payload);
  };

  const handleCancel = () => {
    router.push('/admin/manage');
  };

  if (isChecking) return null;
  if (!isAdmin) return null;

  return (
    <>
      <style>{`
        h3 {
          font-size: 20px;
          font-weight: bold;
        }
        .ant-form-item {
          margin-bottom: 15px !important;
        }
      `}</style>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '560px',
          width: '100%',
          backgroundColor: '#ffffff',
          padding: '20px 200px 25px 200px',
        }}
      >
        <h3>챌린지 수정</h3>
        <Form {...formItemLayout} form={form} onFinish={handleFinish}>
          <Form.Item name="title" rules={[{ required: true, message: '챌린지 이름을 입력하세요.' }]}>
            <Input placeholder="챌린지 이름" />
          </Form.Item>
          <Form.Item name="content" rules={[{ required: true, message: '챌린지 설명을 입력하세요.' }]}>
            <Input.TextArea placeholder="챌린지 설명" />
          </Form.Item>
          <Form.Item name="range" rules={[{ required: true, message: '시작일과 종료일을 선택하세요.' }]}>
            <RangePicker showTime disabledDate={disabledDate} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              수정하기
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="button" onClick={handleCancel} block>
              취소
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
};

export default ChallengeChange;
