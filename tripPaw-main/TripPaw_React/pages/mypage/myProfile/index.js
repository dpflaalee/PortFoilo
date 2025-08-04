import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Checkbox, Form, Input, Space, Card, Avatar, Spin, Typography } from "antd";
import { AntDesignOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from "axios";
import MypageLayout from "@/components/layout/MyPageLayout";
import Router from "next/router";

const { Title } = Typography;


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



const Profile = () => {
  const router = useRouter();
  //const memberId = router.query.id;
  const [user, setUser] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [useremail, setUseremail] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [zonecode, setZonecode] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [memberId, setMemberId] = useState('');
  const [totalPoints, setTotalPoints] = useState(null);  // 추가

  // 추가  
  useEffect(() => {
    const fetchTotalPoints = async () => {
      if (!memberId) return;

      try {
        const response = await axios.get('/api/member/total-points', {
          params: { memberId },
          withCredentials: true,
        });
        setTotalPoints(response.data.totalPoints);
      } catch (error) {
        console.error("포인트 조회 실패:", error);
      }
    };

    fetchTotalPoints();
  }, [memberId]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/auth/check', {
          withCredentials: true,
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
          setMemberId(response.data.id)
          setNickname(response.data.nickname);
          setUseremail(response.data.useremail);
          setRoadAddress(response.data.roadAddress);
          setZonecode(response.data.zonecode);
          setJibunAddress(response.data.jibunAddress);
          // 백엔드에서 받은 username으로 상태 업데이트
          setUsername(response.data.username);

          return true; // 성공 시 true 반환
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push('/member/login');
        return false; // 실패 시 false 반환
      }
    };
    checkLoginStatus();
  }, [])
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value)
  }, [])
  const onChangeEmail = useCallback((e) => {
    setUseremail(e.target.value)
  }, [])
  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);

  }, [])
  
  const [phoneNumRegError, setPhoneNumRegError] = useState(false);
  const [phoneNumLenError, setPhoneNumLenError] = useState(false);
  const onChangePhoneNum = useCallback((e) => {
    setPhoneNumRegError(false);
    setPhoneNumLenError(false);
    setChangePhoneNum(e.target.value);
  }, []);

  const [password, setChangePassword] = useState('');   
  const [passwordError, setPasswordError] = useState(false);
  const onChangePassword = useCallback((e) => {
    const passRegex = /^[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
    const pass = e.target.value;
    setChangePassword(e.target.value);
  }, [password]);
  
  const [passwordRe, setChangePasswordRe] = useState('');
  const [passwordReError, setPasswordReError] = useState(false);
  const onChangePasswordRe = useCallback((e) => {
    console.log('changePasswordRe', e.target.value);
    setChangePasswordRe(e.target.value);
  }, []);

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
  const isStopTimer = useRef(false);
  const [isdupTimer, setIsdupTimer] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const imageInput = useRef();
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
  
  const btnSendAuthenticationNumber = useCallback(async () => {
    if (phoneNum === null || String(phoneNum).length != 11) {
      alert('휴대폰번호를 확인해주세요');
      return;
    }
    setIsDisabled(false);

    const response = await axios.post(`/api/sms/send/${phoneNum}`, {}, {
      withCredentials: true,
    });

    setAuthenticationNum(response.data.code);
    if (isdupTimer) { return; }
    setIsdupTimer(true);
    timer();
  }, [phoneNum, minute, seconds, authenticationNum])

  const [authenNum, setChangeAuthenNum] = useState('');
  const [authenNumError, setAuthenNumError] = useState(false);
  const onChangeAuthenNum = useCallback((e) => {
    setChangeAuthenNum(e.target.value);
  }, [authenNum]);

  const [errAuthenNum, setErrAuthenNum] = useState(false);
  const btnAuthenticationChk = useCallback(() => {
    setErrTimeout(false);
    //인증번호가 같지 않으면
    if (Number(authenticationNum) !== Number(authenNum)) {
      setErrAuthenNum(true);
      return;
    } else {//같다면
      alert('인증되었습니다.');
      setIsDisabled(true);
      setErrTimeout(false);
      setErrAuthenNum(false);
      isStopTimer.current = true;
      clearInterval(timerInterval.current);
    }

  })
  const onChangeZonecode = useCallback((e) => {
    setZonecode(e.target.value);
  }, [])
  const onChangeRoadAddress = useCallback((e) => {
    setRoadAddress(e.target.value);
  }, [])
  const onChangeJibunAddress = useCallback((e) => {
    setJibunAddress(e.target.value);
  }, [])

  const [namujiAddress, setNamujiAddress] = useState('');
  const onChangeNamujiAddress = useCallback((e) => {
    setNamujiAddress(e.target.value);
  })
  const open = useDaumPostcodePopup();
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';

      setZonecode(data.zonecode);  // 우편번호
      setRoadAddress(fullAddress); // 도로명 주소
      setJibunAddress(data.jibunAddress); // 지번주소
    }
  };

  const handleClick = () => {
    open(
      { onComplete: handleComplete },
    );
  };
  const onClickBack = () => {
    return router.back();
  }
  const [imgFile, setImgFile] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null); //전송용 파일 객체를 저장할 state 추가
  useEffect(() => {
    if (memberId) {
      const profileImageResponse = async () => {
        const response = await axios.get(`/api/auth/getProfileImage?id=${memberId}`
          , { withCredentials: true })
        const imgname = response.data.src;
        console.log("profileImage=", response.data.src);
        setProfileImageFile(`/upload/memberImg/${imgname}`);
        profileImageResponse();
      }
    }
  }, [memberId])
  
  const [uploadFile, setUploadFile] = useState(null);
  
  //////
  const saveImgFile = useCallback((e) => {
    const file = e.target.files[0];
    setUploadFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfileImageFile(reader.result);
    };
  }, [imgFile]);

  const onChangeImage = useCallback((e) => {
    const imageFormData = new FormData();

    [].forEach.call(e.target.files, (f) => {
      console.log('filetext=', f)
      return imageFormData.append('profileImage', f);
    });
  const onClickImageUpload = useCallback(() => {
    imageInput.current?.click();
  }, [imageInput.current]);
  const onSubmitForm = useCallback(async (e) => {
    setPhoneNumLenError(false);
    setPhoneNumRegError(false);
    setPasswordError(false);
    setPasswordReError(false);
    const passRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
    const invalidRegex = /[0-9]+/g;
    const invalidStrRegex = /[^0-9]+/g;
    if (!(phoneNum.length >= 0 && phoneNum.length <= 11)) {
      setPhoneNumLenError(true);
      return;
    }

    //일단 전화번호를 11자리 받으면 검사하기
    if (invalidStrRegex.test(phoneNum)) {
      setPhoneNumRegError(true);
      return;
    }
    if (!passRegex.test(password)) {
      setPasswordError(true);
      return;
    }
    if (password !== passwordRe) { return setPasswordReError(true); }

    const formData = new FormData();
    alert('profileImageFile=', profileImageFile.name);
    if (profileImageFile) {
      formData.append('profileImage', uploadFile);
    }

    formData.append("username", username);
    formData.append("useremail", useremail);
    formData.append("nickname", nickname);
    formData.append("password", password);
    formData.append("zonecode", zonecode);
    formData.append("roadAddress", roadAddress);
    formData.append("namujiAddress", namujiAddress);
    formData.append("provider", "nomal");
    console.log(`imageFormData111=`, formData);

    const response = await axios.post('/api/auth/update',
      formData
      , {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })

    alert(response.data);

    router.push('/');

  }, [username, phoneNum, useremail, password, passwordRe, nickname, profileImageFile, zonecode, roadAddress, namujiAddress]);
  return (
    <MypageLayout >
      <div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%", }}>
          <Head>
            <meta charSet="utf-8" />
            <title> Signup | TheJoa </title>
          </Head>
          <div style={{ width: '100%', maxWidth: "70%", margin: '0 auto' }}>
            <Form layout='vertical' style={{ width: '100%', padding: '20px', boxSizing: 'border-box', }} onFinish={onSubmitForm}  >
  
              <Form.Item>
                <label htmlFor='username'></label>
                <UnderlineInput placeholder='이름' id='username'
                  value={username} onChange={onChangeUsername} name='username' required />
              </Form.Item>
              <Form.Item>
                <label htmlFor='nickname'></label>
                <UnderlineInput placeholder='닉네임' id='nickname'
                  value={nickname} onChange={onChangeNickname} name='nickname' required />
              </Form.Item>
              <Form.Item>
                <label htmlFor='password'></label>
                <UnderlineInput type="password" placeholder='비밀번호입력(최소 8~12자리 특수문자포함하여 작성)' id='password'
                  value={password} onChange={onChangePassword} name='password' required />
                {passwordError && <ErrorMessage>비밀번호를 확인해주세요.(최소 8~12자리 특수문자포함) </ErrorMessage>}
              </Form.Item>
              <Form.Item>
                <label htmlFor='password-re'></label>
                <UnderlineInput type="password" placeholder='비밀번호입력 체크' id='password-re'
                  value={passwordRe} onChange={onChangePasswordRe} name='passwordRe' required />
                {passwordReError && <ErrorMessage>비밀번호를 확인해주세요. </ErrorMessage>}
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex' }}>
                  <label htmlFor='phone'></label>
                  <UnderlineInput placeholder='' id='zonecode'
                    value={zonecode} onChange={onChangeZonecode} name='zonecode' readOnly />
                  <Button onClick={handleClick}>우편번호 찾기</Button>
                </div>
              </Form.Item>
                      
              <Form.Item>
                <div style={{ display: 'flex' }}>
                  <label htmlFor='phone'></label>
                  <UnderlineInput placeholder='' id='roadAddress'
                    value={roadAddress} onChange={onChangeRoadAddress} name='roadAddress' readOnly />
                </div>
              </Form.Item>
                      
              <Form.Item>
                <div style={{ display: 'flex' }}>
                  <label htmlFor='phone'></label>
                  <UnderlineInput placeholder='' id='namujiAddress'
                    value={namujiAddress} onChange={onChangeNamujiAddress} name='namujiAddress' />
                </div>
              </Form.Item>

              {/* 총 포인트 추가 */}
              <Form.Item>
                <Card style={{ width: '100%', marginBottom: 20 }}>
                  <Title level={4}>나의 포인트</Title>
                  {totalPoints !== null ? (
                    <p style={{ fontSize: '16px' }}>총 포인트: <strong>{totalPoints}</strong> P</p>
                  ) : (
                    <Spin size="small" />
                  )}
                </Card>
              </Form.Item>
                  
              <Form.Item>
                <div style={{ display: 'flex' }}>
                  <label htmlFor='phone'></label>
                  <Avatar
                    size={{
                      xs: 24,
                      sm: 32,
                      md: 40,
                      lg: 64,
                      xl: 80,
                      xxl: 100,
                    }}
                    src={profileImageFile}
                    icon={<AntDesignOutlined />}
                  />
                  <input
                    type="file"
                    name="profileImage"
                    multiple
                    hidden
                    ref={imageInput}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      saveImgFile(e);
                      // onChangeImage(e);
                    }}
                  />
                  <Button onClick={onClickImageUpload}>프로필편집</Button>
                </div>
              </Form.Item>
                    
              <Form.Item>
                <Space style={{ width: '100%' }}>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    수정하기
                  </Button>
                  <Button htmlType="button" onClick={onClickBack} style={{ width: '100%' }}>
                    돌아가기
                  </Button>
                  <Button htmlType="button" onClick={() => Router.push('/mypage/subscription')} style={{ width: '100%' }}>
                    나의 구독 정보
                  </Button>
                </Space>
              </Form.Item>
                  
            </Form >
          </div >
        </div >
      </div >
    </MypageLayout >
  );
}

export default Profile;
