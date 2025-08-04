import React, { useState, useCallback, useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Link from 'next/Link';
import Router from 'next/router';
import { LOG_IN_REQUEST, LOAD_MY_INFO_REQUEST, LOG_IN_FAILURE } from '@/reducers/user';
import { LOAD_POSTS_REQUEST } from '@/reducers/post';
import axios from 'axios';
import { END } from 'redux-saga';
import wrapper from '../../store/configureStore';
import { useCookies } from "react-cookie";
import { ConsoleSqlOutlined } from "@ant-design/icons";

const ErrorMessage = styled.div`color:red;`
const CusLink = styled(Link)`color: #aaa`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(['userEmail']);
  const { logInLoading, logInDone, logInError } = useSelector(state => state.user);

  const [email, onChangeEmail] = useState(cookies.userEmail || '');
  const [password, setChangePassword] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);
  const [errLoginFlag, setErrLoginFlag] = useState(false);
  const [errLoginMsg, setErrLoginMsg] = useState('');

  useEffect(() => {
    if (logInDone) {
      Router.replace('/main');
    }
  }, [logInDone]);

  useEffect(() => {
    if (cookies.userEmail) {
      onChangeEmail(cookies.userEmail);
      setCheckEmail(true);
    }
  }, [cookies.userEmail]);
  const [isUser, setIsUser] = useState(false);
  useEffect(() => {
    if (logInError) {
      setIsUser(true);
    }
  }, [isUser,logInError]);
  const onChangePassword = useCallback((e) => {
    setChangePassword(e.target.value);
  }, []);

  const onSaveEmail = useCallback((e) => {
    const checked = e.target.checked;
    setCheckEmail(checked);
    if (checked) {
      setCookie('userEmail', email, {
        path: '/',
        maxAge: 60 * 5,
        sameSite: 'lax',
      });
    } else {
      removeCookie('userEmail', { path: '/' });
    }
  }, [email]);

  const onChangeEmailWithCookie = useCallback((e) => {
    const value = e.target.value;
    onChangeEmail(value);
    if (checkEmail) {
      setCookie('userEmail', value, {
        path: '/',
        maxAge: 60 * 5,
        sameSite: 'lax',
      });
    }
  }, [checkEmail]);

  const onSubmitForm = useCallback(() => {
    setErrLoginFlag(false);
    setErrLoginMsg('');
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  return (
    <div style={{ width: '100%', maxWidth: "70%", margin: '0 auto' }}>
      <Form
        layout="vertical"
        style={{
          width: '100%',
          padding: '20px',
          boxSizing: 'border-box',
        }}
        initialValues={{
          email: cookies.userEmail || '',
          remember: checkEmail,
        }}
        onFinish={onSubmitForm}
        autoComplete="off"
      >
        <h1 style={{ textAlign: 'center' }}>SSDAM</h1>

        <Form.Item
          label="이메일"
          name="email"
          rules={[
            { required: true, message: '이메일을 확인해주세요' },
          ]}
        >
          <Input
            placeholder="user@gmail.com 형식으로 입력"
            value={email}
            onChange={onChangeEmailWithCookie}
            //type="email"
            required
          />
        </Form.Item>

        <Form.Item
          label="비밀번호"
          name="password"
          rules={[
            { required: true, message: "비밀번호를 확인해주세요" },
          ]}
        >
          <Input.Password
            placeholder="비밀번호 입력"
            value={password}
            onChange={onChangePassword}
            required
          />
        </Form.Item>
          {isUser && <ErrorMessage>{logInError?.message}</ErrorMessage>}
        <Form.Item
          name="remember"
          valuePropName="checked"
        >
          <Checkbox checked={checkEmail} onChange={onSaveEmail}>이메일 기억하기</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            loading={logInLoading}
            style={{ width: '100%' }}
            htmlType="submit"
          >
            로그인
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <CusLink href={"/user/signup"} style={{ paddingRight: '50px' }}>회원가입</CusLink>
          {/* <CusLink href={"/user/find"}>비밀번호 찾기</CusLink> */}
        </div>
      </Form>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_POSTS_REQUEST });
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();
});

export default LoginForm;
