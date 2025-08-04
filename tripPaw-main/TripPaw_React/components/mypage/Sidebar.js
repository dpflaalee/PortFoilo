import React, { useCallback, useEffect, useState } from 'react';
import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Modal, Input } from 'antd';

const ErrorMessage = styled.div`color:red;`;
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
const Wrapper = styled.div`
  width: 240px;
  padding: 24px;
  border-right: 1px solid #ddd;
  height: 100%;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 32px;
  color: red;
`;

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [changePass, setChangePass] = useState('');
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const router = useRouter();

  const isLoading = user === null && !isAdmin;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get('/api/auth/check', {
          withCredentials: true,
        });

        if (response.status === 200) {
          const data = response.data;
          setUser({
            nickname: data.nickname,
            username: data.username,
            memberId: data.memberId,
          });

          setIsAdmin(data.auth === 'ADMIN');
        }
      } catch (error) {
        console.error('사용자 정보 확인 실패:', error);
        setIsAdmin(false);
      }
    };

    checkUser();
  }, []);
  
  const onChangePass = useCallback((e) => {
    const newPass = e.target.value;
    setChangePass(e.target.value);
  }, [])
  
  const showModal = (menu) => {
    menu === 'passChangeConfirm' ? setIsChangePassModalOpen(true) : setIsUserDeleteModalOpen(true);
  };
  
  //탈퇴
  const [userDeleteConfirm, setUserDeleteConfirm] = useState(false);
  const onUserDeleteConfirm = () => {
    console.log('userDeleteConfirm=', userDeleteConfirm);
    setUserDeleteConfirm(prev => !prev);
    showModal('userDeleteConfirm');
  }
  
  const handleOk = useCallback(async (str) => {
    const passRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
    const formData = new FormData();
    setPasswordError(false);
    if (str === 'changePass') {
      formData.append('changePass', changePass);
      if (!passRegex.test(changePass)) {
        setPasswordError(true);
        dispatch({ type: USER_PASSWORD_CHANGE_FAILURE }) //초기화
        return;
      }
      dispatch({
        type: USER_PASSWORD_CHANGE_REQUEST,
        data: changePass,
      })

      setChangePass('');
      setPasswordError(false);
      return;
    }
    
    if (str === 'deleteUser') {
      await axios.post('/api/auth/memberDelete'
        , {
          password: changePass
        }
        , { withCredentials: true })
        .then(function (response) {
          if (response.status == 400) {
            alert(response.data.error);
            return;
          }
          if (response.status == 200) {
            alert(response.data.message);
            axios.post('/api/auth/logout', {}, { withCredentials: true })
            router.replace('/');
          }

        })
        .catch(function (error) {
          setDeleteModal(true);
          setDeleteMessage(error.response.data.message);
        })
      return;
    }
    setChangePass('');
    setSamePass(false);
  }, [changePass]);
  
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const onPassChangeConfirm = useCallback(() => {
    setIsChangePassModalOpen(prev => !prev);
    showModal('passChangeConfirm');
  })
  const [passwordError, setPasswordError] = useState(false);
  const [samePass, setSamePass] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  
  useEffect(() => {
    setDeleteMessage(str => str);
  }, [deleteMessage])
  
  const handleCancel = useCallback(() => {
    setIsChangePassModalOpen(false);
    setIsUserDeleteModalOpen(false);
    setPasswordError(false);
    setChangePass('');
    setSamePass(false);
    setDeleteMessage('');
    setDeleteModal(false);
    setUserDeleteConfirm(prev => !prev)
  }, []);

  if (isLoading) return null; 

  return (
    <Wrapper>
      {/* 유저 전용 항목 */}
      {!isAdmin && user && (
        <>
          <SidebarSection title={`안녕하세요, ${user.nickname}님`}>
            <SidebarItem text="내 정보 관리" href="/mypage/myProfile" />
            <SidebarItem text="쿠폰함" href="/mypage/coupons" />
          </SidebarSection>

          <SidebarItem text="반려동물 여권" href={`/mypage/petpass/${user?.memberId}`} />
          <SidebarItem text="예약 내역 보기" href="/mypage/reserv/reservlist" />
          <SidebarItem text="내 장소" href="/mypage/places" />
          <SidebarItem text="내 여행" href="/mypage/trips" />

          <SidebarItem text="내 리뷰 관리" href={`/mypage/reviews/${user?.memberId}`} />
          {/* memberId 없으면 렌더링 안 하도록 */}
          {user.memberId && (
            <SidebarItem
              text="내 체크리스트"
              href={`/mypage/checklist/mychecklist/${user.memberId}`}
              active={
                router.asPath ===
                `/mypage/checklist/mychecklist/${user.memberId}`
              }
            />
          )}
          <SidebarItem text="내 뱃지" href={`/mypage/badges/${user?.memberId}`} />
        </>
      )}

      {/* 관리자 전용 항목 */}
      {isAdmin && (
        <>
          <SidebarSection title="관리자">
            <SidebarItem text="체크리스트 관리" href="/mypage/checklist" />
            <SidebarItem text="쿠폰 관리" href="/mypage/coupons/manage" />
            <SidebarItem text="카테고리 관리" href="/mypage/categories" />
            <SidebarItem text="도장 관리" href="/admin/seal" />
            <SidebarItem text="신고 관리" href="/mypage/reports" />
            <SidebarItem text="뱃지 관리" href="/admin/badge" />
            <SidebarItem text="리뷰 관리" href="/admin/review" />
          </SidebarSection>
        </>
      )}

      {!isAdmin && user && (
        <Footer>
          <div style={{ cursor: 'pointer' }}>로그아웃</div>
          <div style={{ cursor: 'pointer' }} onClick={onUserDeleteConfirm}>탈퇴하기</div>
          {isUserDeleteModalOpen && (<Modal title="탈퇴하기" open={isUserDeleteModalOpen} onOk={() => handleOk('deleteUser')} onCancel={handleCancel}>
            <UnderlineInput type='password' name='changePass' value={changePass} onChange={onChangePass} placeholder="현재 비밀번호를 입력해주세요." />
            {deleteModal && <ErrorMessage>비밀번호를 확인해주세요.(최소 8~12자리 특수문자포함)</ErrorMessage>}
          </Modal>)}
        </Footer>
      )}
      {isAdmin && (
        <Footer>
          <div style={{ cursor: 'pointer' }}>로그아웃</div>
        </Footer>
      )}
    </Wrapper>
  );
};

export default Sidebar;
