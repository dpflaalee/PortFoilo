import React, { useCallback,useState } from "react";
import {Form,Input, Button,Card, Typography } from 'antd';
import axios from "axios";
import { useRouter } from "next/router";


const FindForm = () => {
    const router = useRouter();
    const {userEmail, token} = router.query;
    const { Title } = Typography;
    const [newPassword, setNewPassword] = useState('');
    
    const onChangeUserPassword = useCallback((e)=>{
        setNewPassword(e.target.value);
    })
    const onSubmitPassword = useCallback(async ()=>{
        console.log(userEmail);
    },[newPassword])

    //////////////////////////////
    return (
        <div style={{
          width: '100%',         
          maxWidth: '700px',    
          margin: '0 auto',     
          //border: '1px solid #ccc',
          padding: '20px',
          paddingRight: '120px',
          boxSizing: 'border-box',
          
        }}>
            <Card title="">
                <Title level={4}>비밀번호 변경</Title>
                
                <Form onFinish={onSubmitPassword}>
                    <span style={{fontSize:"10px", color:"lightgray"}}>변경할 비밀번호를 입력해주세요.</span>
                    <Form.Item 
                    >
                        <Input type="" value={newPassword} onChange={onChangeUserPassword} placeholder="새로운 비밀번호 입력"/>
                    </Form.Item>
                    <Button type="primary" style={{width:'100%'}} htmlType="submit" className="email-form-button">
                        비밀번호 변경
                    </Button>
                </Form>
            </Card>
        </div>
    );
}

export default FindForm;
