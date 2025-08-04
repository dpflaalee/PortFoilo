import React, { useState, useRef, useEffect, useCallback } from "react";
import { MailOutlined, HomeOutlined, NotificationOutlined, SearchOutlined, TeamOutlined, BellOutlined, UserOutlined, BellTwoTone, AuditOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Button, Modal, Card, Skeleton, Input, Form } from "antd";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { LOG_OUT_REQUEST, USER_PROFILE_UPDATE_REQUEST, USER_IMAGE_UPDATE_REQUEST } from "@/reducers/user";
import { LOAD_NOTIFICATION_REQUEST } from "@/reducers/notification";
import { LOAD_USER_GROUPS_REQUEST } from "@/reducers/group";
import userInput from "@/hooks/userInput";

const { SubMenu } = Menu;
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

const Nav = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const dispatch = useDispatch(); 
  const{userGroups} = useSelector((state)=>state.group);
  
  useEffect(()=>{
    dispatch({type: LOAD_USER_GROUPS_REQUEST});
  }, [dispatch]);

  const { logOutLoading, user, userImagePaths } = useSelector(state => state.user);
  const [nickname, onChangeNickname, setNickname] = userInput(user?.nickname); 
  
  const onLogout = useCallback(() => {
     dispatch({ type: LOG_OUT_REQUEST }) 
     router.replace('/');
    }, [])
  useEffect(()=>{
    dispatch({type: LOAD_USER_GROUPS_REQUEST});
  }, [dispatch]);
    //닉네임 초기값
  useEffect(() => {
    if (user?.nickname) {
      setNickname(user?.nickname);
    }
  }, [user?.nickname]);
  //탈퇴하기
  const onUserDelete = useCallback(()=> {

  })
  //프로필 수정 모달
  const [modalFlag, setModalFlag] = useState(false);
  const onUserProfileUpdate = useCallback(() => {
    setModalFlag(prev => !prev);
  }, [])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setModalFlag(true);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [loading, setLoading] = useState(false);
  const onChange = (checked) => {
    setLoading(!checked);
  };

  const imageInput = useRef();
  const filename = user?.UserProfileImages[0]?.src;
  const onClickImageUpload = useCallback(() => {
      imageInput.current?.click();
  }, [imageInput.current]);
  const onChangeImage = useCallback((e) => {
    const imageFormData = new FormData();

      [].forEach.call(e.target.files, (f)=>{
         return imageFormData.append('profileImage',f);
     });
    dispatch({
      type:USER_IMAGE_UPDATE_REQUEST,
      data:imageFormData,
    })
  }, []);
  useEffect(() => {
    const handleResize = () => { setIsMobile(window.innerWidth <= 768); };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();
  const saveImgFile = useCallback(() => {
    const file = imageInput.current.files[0];
    const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
          setImgFile(reader.result);
      };
  },[imgFile]);

  const onMyPage = useCallback(() => {
    router.push(`/user/myPage/${user.id}`)
  },[]);

  
  const onSubmitForm = useCallback((e) => {
    if(!nickname || !nickname.trim()){
      return alert('닉네임을 작성하세요.')
    }
    const formData = new FormData();
    userImagePaths.forEach((i) => {formData.append('profileImage', i)});
    formData.append('nickname', nickname);
    dispatch({
      type: USER_PROFILE_UPDATE_REQUEST,
      data: formData  
    });
    setModalFlag(false);
    window.location.href = '/main';
  }, [nickname,userImagePaths]);


  const handleClick = ({ key }) => {
    if (key === 'notice') router.push('/adminNoti');
    if (key === 'home') router.push('/main');
    if (key === 'groupHome') router.push('/groups');
    if (key === 'notification') router.push('/notification');
    if (key === 'search') router.push('/search');
    if (key === 'chat') router.push('/chat');
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profileUpdate" onClick={showModal}>프로필 수정</Menu.Item>
      <Menu.Item key="logout" onClick={onLogout} loading={logOutLoading}>로그아웃</Menu.Item>
      <Menu.Item key="deactivate" onClick={onUserDelete} style={{ color: 'red' }}>탈퇴하기</Menu.Item>
    </Menu>
  );

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  // 새로 온 알림
  const { hasNewNotification } = useSelector(state => state.notification);
  dispatch({
    type: LOAD_NOTIFICATION_REQUEST
  }, [dispatch]);

  const me = useSelector(state => state.user);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", justifyContent: "flex-start", gap: "10px", }} >
        
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer", marginTop: "20px", padding: "15px", }} >
            <Avatar size="large" onClick={onMyPage} src= {imgFile ? imgFile: `http://localhost:3065/userImages/${filename}`} />
            <Dropdown overlay={profileMenu} trigger={["click"]}>
            <div>
              {!isMobile && user && (
              <div style={{ marginLeft: "10px" }}>
                <strong>{user?.nickname}</strong>
                <div style={{ color: "#888" }}>{user?.email}</div>
              </div>
            )}
             </div>
            </Dropdown>
          </div>
        

        <Menu
          mode={isMobile ? "horizontal" : "inline"}
          selectedKeys={[]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={handleClick}
          style={{
            width: isMobile ? "auto" : "100%",
            borderRight: "none",
            background: "transparent",
          }}
        >
          <Menu.Item key="notice" icon={<NotificationOutlined />}>{!isMobile && "공지"}</Menu.Item>
          <Menu.Item key="home" icon={<HomeOutlined />}> {!isMobile && "홈"} </Menu.Item>
          <SubMenu key="group" icon={<TeamOutlined />} title={!isMobile && "그룹"}>
            <Menu.Item key="groupHome" style={{ fontWeight: 'bold' }}>그룹 홈</Menu.Item>

            {userGroups && userGroups.map((group) => (
              <Menu.Item key={`group-${group.id}`} onClick={() => router.push(`/groups/${group.id}`)} >
                {group.title}
              </Menu.Item>
            ))}
          </SubMenu>
          <Menu.Item
            key="notification"
            icon={hasNewNotification ? <BellTwoTone twoToneColor="#eb2f96" /> : <BellOutlined />}
          >
            {!isMobile && "알림"}
          </Menu.Item>
          <Menu.Item key="search" icon={<SearchOutlined />}>{!isMobile && "검색"}</Menu.Item>
          {(me.user && me.user.isAdmin) ? <Menu.Item key="admin" onClick={() => router.push('/admin')} icon={<AuditOutlined />}>{!isMobile && "관리자 페이지"}</Menu.Item> : ''}
        </Menu>
      </div>
      {modalFlag &&
        <Form onFinish={onSubmitForm}>
          <div>

          <Modal title="프로필 수정" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          footer={[
           <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }} key="footer-buttons">
            <Form.Item style={{ margin: 0 }}>
              <input
                type="file"
                name="profileImage"
                multiple
                hidden
                ref={imageInput}
                style={{ display: 'none' }}
                onChange={(e) => {
                  saveImgFile(e);
                  onChangeImage(e);
                }}
              />
              <Button onClick={onClickImageUpload}>프로필편집</Button>
            </Form.Item>
            <Button onClick={onSubmitForm} key="submit" type="primary" loading={loading}>
              프로필변경
            </Button>
            <Button key="back" onClick={handleCancel}>
              나가기
            </Button>
          </div>,
          ]}
          >
            <Card
              style={{
                width: 450,
                marginTop: 16,
              }}
              actions={[
              ]}
            >
                <Card.Meta
                  avatar={<Avatar src={imgFile ? imgFile: `http://localhost:3065/userImages/${filename}`} />}
                  title={<div style={{ fontSize: '15px', color: 'black' }}>{nickname}</div>}
                  description=""
                  style={{
                    marginBottom: 16,
                  }}
                />
                <UnderlineInput name='nickname' value={nickname} onChange={onChangeNickname} placeholder="기존 닉네임 노출(해당 칸에 입력하여 변경)" />
              </Card>
            </Modal>
          </div>
        </Form>
      }
    </div>

  );
};

export default Nav;
