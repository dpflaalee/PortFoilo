import React,{ useState, useCallback,useEffect,useRef } from "react";
import {Button, Checkbox, Form, Input } from "antd";
import Head from 'next/head';
import AppLayout from "@/components/AppLayout";
import userInput from '@/hooks/userInput';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';  
import Router from 'next/router';
import axios from "axios";

import { SIGN_UP_REQUEST } from '@/reducers/user';

const ErrorMessage = styled.div`color:red;`;   //style.div( color:red; )
const UnderlineInput = styled(Input)`
  border: none;
  border-bottom: 1px solid #d9d9d9;
  border-radius: 0;
  box-shadow: none;

  &:focus,
  &.ant-input-focused {
    border-bottom: 2px solid #1677ff;
    box-shadow: none;
  }
`;

const signup = () => {
    const {signUpLoading , signUpDone , signUpError , user} = useSelector( state =>state.user );
  const dispatch = useDispatch();

  useEffect(() => { 
    if ( user &&  user.id) {   Router.replace('/');  }
  } , [user &&  user.id]);

  useEffect(() => {
    if ( signUpDone ) {   Router.replace('/');   }
  } , [signUpDone]);

  useEffect(() => { 
    if ( signUpError ) {  alert(signUpError);   }
  } , [signUpError]);

    //const [email, setChangeEmail] = userInput('');
    const [nickname, onChangeNickname] = userInput('');
    //const [password, setChangePassword] = userInput(''); 

    const [email, setChangeEmail] = useState('');
    const onChangeEmail = useCallback((e) => {
      setChangeEmail(e.target.value)
    },[])
    const [username, setChangeUsername] = useState('');
    const onChangeUsername = useCallback((e) => {
      setChangeUsername(e.target.value);

    },[])
    const [phoneNum, setChangePhoneNum] = useState('');
    const [phoneNumRegError, setPhoneNumRegError] = useState(false);
    const [phoneNumLenError, setPhoneNumLenError] = useState(false);
    const onChangePhoneNum = useCallback((e) => {
      setPhoneNumRegError(false);
      setPhoneNumLenError(false);
      setChangePhoneNum(e.target.value);
        },[]);
    
    
    // const [nickname, setChangeNickname] = useState('');
    // const onChangeNickname = useCallback((e) => {
    //   setChangeNickname(e.target.value);

    // },[])
  const [password, setChangePassword] = useState('');   // userInput  줄이기
  const [passwordError, setPasswordError] = useState(false);
  //const [passwordRegError, setPasswordRegError] = useState(false);
  const onChangePassword = useCallback((e) => {
      const passRegex = /^[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
      const pass = e.target.value; 
      // if(!passRegex.test(password)){
      //   setChangePassword(true);
      // }
      setChangePassword(e.target.value);
  },[password]);
  const [passwordRe, setChangePasswordRe] = useState('');
  const [passwordReError, setPasswordReError] = useState(false);
  const onChangePasswordRe = useCallback((e) => { 
    setChangePasswordRe(e.target.value);
  } , []);

  function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  } 
  const [time, setTime] = useState();
  const [minute, setMinute] = useState();
  const [seconds, setSeconds] = useState();
  const [timerFlag, setTimerFlag] = useState(false);
  const [errTimeout, setErrTimeout] = useState(false);
  const [authenticationNum, setAuthenticationNum] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  //const [isStopTimer, setIsStopTimer] = useState(false);
  const isStopTimer = useRef(false);
  const [isdupTimer, setIsdupTimer] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  let stopTimer = false;
  const timerInterval = useRef(null);  // 새 ref 추가

const timer = () => {
  let totalSeconds = 60; // 예시: 1분
  setTimerFlag(true);
  setErrTimeout(false);

  timerInterval.current = setInterval(() => {
    if (totalSeconds <= 0 || isStopTimer.current) {
      clearInterval(timerInterval.current);
      if (totalSeconds <= 0) {
        setErrTimeout(true);
        setIsDisabled(true);
        setIsdupTimer(false);
      }
      return;
    }

    const minute = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    setMinute(minute);
    setSeconds(seconds < 10 ? `0${seconds}` : `${seconds}`);
    totalSeconds--;
  }, 1000);
};
    const btnSendAuthenticationNumber = useCallback( async () => {
      if(phoneNum === null || String(phoneNum).length != 11 ){
        alert('휴대폰번호를 확인해주세요');
        return;
      }
      setIsDisabled(false);
      const response = await axios.post(`http://localhost:3065/user/sms/${phoneNum}`,{},{
       withCredentials: true,
      });
      setAuthenticationNum(response.data);
      if(isdupTimer){return;}
       //setStopTimer(true); 
       setIsdupTimer(true);
      timer();
    
    //setTime(setTimeout( ),10000);
    },[phoneNum,minute,seconds,authenticationNum])

  const [authenNum, setChangeAuthenNum] = useState('');
    const [authenNumError, setAuthenNumError] = useState(false);
    const onChangeAuthenNum = useCallback((e) => {
      
      setChangeAuthenNum(e.target.value);
    },[authenNum]);
    
  const [errAuthenNum, setErrAuthenNum] = useState(false);
  const btnAuthenticationChk = useCallback(() => {
    setErrTimeout(false);
    if(Number(authenticationNum) !== Number(authenNum)){
      setErrAuthenNum(true);
      return;
    }else{
      alert('인증되었습니다.');
      setIsDisabled(true);
      setErrTimeout(false);
      setErrAuthenNum(false);
      //setIsStopTimer(true);
      isStopTimer.current = true;
      clearInterval(timerInterval.current);
    }

  })

  const onSubmitForm = useCallback(() => {
     setPhoneNumLenError(false);
     setPhoneNumRegError(false);
     setPasswordError(false);
     setPasswordReError(false);
    const passRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
    const invalidRegex = /[0-9]+/g;
    const invalidStrRegex = /[^0-9]+/g;
    if(!(phoneNum.length >=0 && phoneNum.length <= 11)){
      setPhoneNumLenError(true);
      return;
    }

    if(invalidStrRegex.test(phoneNum)){
      setPhoneNumRegError(true);
      return;
    }
    if(!passRegex.test(password)){
      setPasswordError(true);
      return;
    }
    if (password !== passwordRe) { return setPasswordReError(true); }

    return dispatch({
      type: SIGN_UP_REQUEST, 
      data:{ username, phoneNum, email, password, nickname  }
    }); 
    
  } , [username, phoneNum, email, password, passwordRe, nickname]);
    return (
         <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%",}}>
      <Head>
        <meta charSet="utf-8"/>
        <title> Signup | TheJoa </title>
      </Head>
      <div  style={{ width: '100%', maxWidth: "70%", margin: '0 auto' }}>
         <Form  layout='vertical' style={{  width: '100%', padding: '20px', boxSizing: 'border-box',}}  onFinish={onSubmitForm}  > 
        
          <Form.Item>
            <label htmlFor='username'></label>
            <UnderlineInput placeholder='이름' id='username'
                value={username} onChange={onChangeUsername}    name='username' required />
          </Form.Item>
          <Form.Item>
             <label htmlFor='nickname'></label>
            <UnderlineInput placeholder='닉네임' id='nickname'
                value={nickname} onChange={onChangeNickname}  name='nickname'  required />
          </Form.Item>          
          <Form.Item>
            <label htmlFor='email'></label>
            <UnderlineInput placeholder='이메일' id='email' type="email"
                value={email} onChange={onChangeEmail}    name='email' required />
          </Form.Item>
          <Form.Item>
            <div style={{display:'flex'}}>
                <label htmlFor='phone'></label>
                <UnderlineInput placeholder='휴대폰' id='phone'
                    value={phoneNum} onChange={onChangePhoneNum}    name='phone' required />
                <Button onClick={btnSendAuthenticationNumber}>인증번호 전송</Button>
              </div>
                {phoneNumRegError   && <ErrorMessage>휴대전화번호: 휴대전화번호가 정확한지 확인해 주세요.</ErrorMessage>}
                {phoneNumLenError   && <ErrorMessage>휴대전화번호: 11자리까지 입력가능합니다.</ErrorMessage>}
          </Form.Item>
          <Form.Item>
            <div style={{position: 'relative'}}>
              <div style={{display:'flex', alignItems: 'center'}}>
                <label htmlFor='authenNum'></label>
                {/* <UnderlineInput placeholder='인증번호' id='authenNum'
                    alue={authenNum} onChange={onChangeAuthenNum}  name='authenNum' required/> */}
                <UnderlineInput placeholder='인증번호' id='authenNum'
                    value={authenNum} onChange={onChangeAuthenNum}  name='authenNum' required disabled={isDisabled}/>
                <Button onClick={btnAuthenticationChk}>확인</Button>
                  {timerFlag &&  (<span style={{
                    position: 'absolute',
                    right: '70px',
                    top: errTimeout ? '31%' : '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa',
                    fontSize: '12px'
                  }}>
                      {minute}:{seconds}
                  </span>)}
             </div>
             <div style={{display:"block"}}>
               {errTimeout && (<ErrorMessage  style={{ marginTop: '4px' }}> 10초 안에 입력해주세요.</ErrorMessage>)}
               {errAuthenNum && (<ErrorMessage  style={{ marginTop: '4px' }}>인증번호를 다시 입력하세요!</ErrorMessage>)}
             </div>
            </div>
          </Form.Item>
          <Form.Item>
             <label htmlFor='password'></label>
            <UnderlineInput type="password" placeholder='비밀번호입력(최소 8~12자리 특수문자포함하여 작성)' id='password'
              value={password} onChange={onChangePassword} name='password' required />
            {passwordError   && <ErrorMessage>비밀번호를 확인해주세요.(최소 8~12자리 특수문자포함) </ErrorMessage>}
          </Form.Item>
          <Form.Item>
            <label htmlFor='password-re'></label>
            <UnderlineInput type="password" placeholder='비밀번호입력 체크' id='password-re'
              value={passwordRe} onChange={onChangePasswordRe} name='passwordRe' required />
            {passwordReError   && <ErrorMessage>비밀번호를 확인해주세요. </ErrorMessage>}
          </Form.Item>
          <Form.Item>
           
          </Form.Item> 
          <Form.Item>
            <Button type='primary'   htmlType='submit' loading={signUpLoading} style={{width:'100%'}} >회원가입</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    )
}

export default signup;
