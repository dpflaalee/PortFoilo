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

const EventScheduleForm = () => {
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
          router.replace('/admin/manage');
          }
        }
      } catch (error) {
        router.replace('/admin/manage');
        message.error('정보 불러오기에 실패했습니다.');
      } finally {
        setIsChecking(false);
      }
    };
    if (isChecking) { fetchUser(); }}, [isChecking, router]);

  const onFinish = async (values) => {
    try {
      const [start, end] = values.range;

      const response = await axios.post(
        'http://localhost:3065/calendar',
        {
          title: values.title,
          content: values.content,
          startDate: dayjs(start).toISOString(),
          endDate: dayjs(end).toISOString(),
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        message.success('일정 등록 완료');
        form.resetFields();
        router.push('/admin/manage');
      } else {
        message.error('일정 등록 실패 (서버 응답 오류)');
      }
    } catch (error) {
      message.error('일정 등록 실패');
    }
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
        <h3>일정 추가</h3>
        <Form {...formItemLayout} form={form} onFinish={onFinish}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: '일정명을 입력하세요.' }]}
          >
            <Input placeholder="일정명" />
          </Form.Item>

          <Form.Item
            name="content"
            rules={[{ required: true, message: '일정 설명을 입력하세요.' }]}
          >
            <Input.TextArea placeholder="일정 설명" />
          </Form.Item>

          <Form.Item
            name="range"
            rules={[{ required: true, message: '시작일과 종료일을 선택하세요.' }]}
          >
            <RangePicker showTime disabledDate={disabledDate} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              등록
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
  );
};

export default EventScheduleForm;
