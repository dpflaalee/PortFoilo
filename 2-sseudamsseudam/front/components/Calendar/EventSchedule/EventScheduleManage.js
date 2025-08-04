//챌린지 폼 (임시, 기능X)
import React from 'react';
import { Divider, DatePicker, Input, Form, Button, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const dateView = {
  color: '#807E7E',
};

const date = {
  color: '#807E7E',
  fontSize: '13px',
  marginLeft: '5px',
  // marginTop: '0.5em',
};
 
const EventScheduleManage = () => {
  const [form] = Form.useForm();
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
        .ant-divider-horizontal {
        margin: 15px 0;
        }
      `}</style>
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%',  backgroundColor: '#ffffff', padding: '20px 200px 25px 200px', }} >
        <div style={{display: 'flex'}}>
          <h3 style={{ marginBottom: '0px'}}>진행중인 챌린지</h3>
          <div style={{display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '0%', gap: '10px'}}>
              <Button type="primary">챌린지 생성</Button>
        </div>
      </div>
        <Divider />

        <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: '0%', marginRight: '0%', gap: '10px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <h3 style={{marginBottom: '-1%'}}>메가주 일산</h3>
            <span style={date}>NN.NN.NN(D) ~ NN.NN.NN(D)</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '0%', flexDirection: 'row', gap: '10px'}}>
            <Button type="primary">챌린지 수정</Button><Button>챌린지 삭제</Button>
          </div>
        </div>


      <Button>더보기</Button>
      </div>
    </>
  );
};

export default EventScheduleManage;