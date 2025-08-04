import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Dropdown, Menu, Button, message, Modal } from 'antd';
import { HomeOutlined, NotificationOutlined, TeamOutlined, SearchOutlined, MailOutlined, PlusOutlined, BellOutlined,MoreOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_GROUP_REQUEST, LEAVE_GROUP_REQUEST } from '@/reducers/group';

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  box-sizing: border-box;
`;

const LeftWrapper = styled.div`
  align-items: center;
  min-width: 0;
  max-width: 50%;
  flex-shrink: 1;
`;

const RightWrapper = styled.div`
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  max-width: 50%;
  flex-shrink: 1;
`;

const menuItems = [
  { key: 'notice', label: '공지', icon: <NotificationOutlined />, path: '/notice' },
  { key: 'home', label: '홈', icon: <HomeOutlined />, path: '/main' },
  { key: 'groups', label: '그룹', icon: <TeamOutlined />, path: '/groups' },
  { key: 'notification', label: '알림', icon: <BellOutlined />, path: '/notification' },
  { key: 'search', label: '검색', icon: <SearchOutlined />, path: '/search' },
  { key: 'chat', label: '채팅', icon: <MailOutlined />, path: '/chat' },
];

const ContentHeader = ({group, members}) => {
  const router = useRouter(); const dispatch = useDispatch();

  const currentUser = useSelector((state)=>state.user.user);

  const [showDeleteModal, setShowDeleteModal]= useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const isGroup = router.pathname.startsWith('/groups/[id]');

  const isLeader = Array.isArray(members)
    ? members.some(member => String(member.id) === String(currentUser?.id) && (member.isLeader === true || member.isLeader === 1))
    : false;

const isGroupMember = Array.isArray(group?.groupmembers)
  ? group.groupmembers.some(member => String(member.id) === String(currentUser?.id))
  : false;
  
  const {deleteGroupDone, leaveGroupDone, leaveGroupError} = useSelector((state)=>state.group);
  
  useEffect(()=>{
    if(leaveGroupDone){
      message.success('그룹에서 탈퇴했습니다.');
      router.push('/groups');
    }
    if(leaveGroupError){
      message.error(leaveGroupError);
    }
  }, [leaveGroupDone, leaveGroupError]);


  useEffect(()=>{
    if(deleteGroupDone){
      message.success('그룹이 삭제되었습니다.');
      router.push('/groups');
    }
  }, [deleteGroupDone]);

  const currentMenu = menuItems.find((item) => router.pathname.startsWith(item.path)) || menuItems[1];

  const handleMenuClick = ({ key }) => {
    const selected = menuItems.find((item) => item.key === key);
    if (selected) { router.push(selected.path);  }
  };
//----------------------------------------------------------code그룹관련메뉴
const handleGroupMenuClick  = ({key})=>{
  if (!group) {
    message.error('그룹 정보를 불러올 수 없습니다.');
    return;
  }
  
  if (key === 'edit') { router.push(`/groups/${group.id}/edit`);
} else if (key === 'delete') { setShowDeleteModal(true);
} else if (key === 'leave') { setShowLeaveModal(true); }
}

const groupMenu = (
  <Menu onClick={handleGroupMenuClick }>
      {isLeader && (
        <>
          <Menu.Item key="edit">수정하기</Menu.Item>
          <Menu.Item key="delete" danger>삭제하기</Menu.Item>
          <Menu.Item key="leave" danger>탈퇴하기</Menu.Item>
        </>
      )}
      {!isLeader && isGroupMember && <Menu.Item key="leave" danger>탈퇴하기</Menu.Item>}
  </Menu>
)
  
  const handleDeleteGroup = () => {
    dispatch({type: DELETE_GROUP_REQUEST, data: group.id});
    setShowDeleteModal(false);
  };
  
  const handleLeaveGroup = ()=>{
    setShowLeaveModal(false);

    if(isLeader){
      message.warning('방장 권한을 다른 멤버에게 양도한 뒤 탈퇴할 수 있습니다.');
      return;    }
    
    dispatch({ type: LEAVE_GROUP_REQUEST, data: { groupId: group.id } });
  }
  //----------------------------------------------------------code그룹관련메뉴
  
  return (
    <HeaderWrapper>
      <LeftWrapper>
        <Dropdown
          overlay={
            <Menu onClick={handleMenuClick}>
              {menuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={currentMenu.icon}>{currentMenu.label}</Button>
        </Dropdown>
      </LeftWrapper>

{/* ------------------------------------------view그룹관련메뉴 */}
      <RightWrapper>
        {router.pathname.startsWith('/groups') && (
          <>
            <Button
              icon={<PlusOutlined />}
              style={{ border: 'none' }}
              onClick={() => router.push('/groups/form')}
            />
            {isGroup && (
              <Dropdown overlay={groupMenu} trigger={['click']}>
                <Button icon={<MoreOutlined />} style={{ marginLeft: 8, border: 'none' }} />
              </Dropdown>
            )}
          </>
        )}
{/* ------------------------------------------view그룹관련메뉴 */}
        
      </RightWrapper>
      {/* 그룹삭제모달 */}
      <Modal 
        open={showDeleteModal} onOk={handleDeleteGroup} onCancel={()=>setShowDeleteModal(false)} okText="삭제" cancelText="취소" okButtonProps={{danger:true}}
      >
        <p>정말로 이 그룹을 삭제하시겠습니까?</p>
        <p style={{color:'red'}}>삭제하면 복구할 수 없습니다.</p>
      </Modal>

      {/* 탈퇴모달 */}
      <Modal
        open={showLeaveModal} onOk={handleLeaveGroup} onCancel={()=>setShowLeaveModal(false)} okText="탈퇴" cancelText="취소"
      >
        {isLeader?(
          <>
            <p>방장은 그룹을 탈퇴할 수 없습니다.</p>
            <p style={{color:'red'}}>방장 권한을 다른 멤버에게 위임한 뒤 탈퇴할 수 있습니다.</p>
          </>
        ):(<p>정말로 그룹에서 탈퇴하시겠습니까?</p>)}
      </Modal>
    </HeaderWrapper>

  );
};

export default ContentHeader;
