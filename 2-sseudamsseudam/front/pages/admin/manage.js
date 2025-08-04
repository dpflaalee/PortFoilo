import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';
import AppLayout from "@/components/AppLayout";
import PrizeManage from '@/components/prize/PrizeManage';
import 'antd/dist/antd.css';
import axios from 'axios';
import wrapper from '../../store/configureStore';
import { END } from 'redux-saga';
import { LOAD_MY_INFO_REQUEST } from '@/reducers/user';

import { useSelector } from "react-redux";

import CategoryManage from "@/components/category/CategoryManage"
import EventScheduleList from '@/components/Calendar/EventSchedule/EventScheduleList';
import ChallengeList from '@/components/Calendar/Todolist/ChallengeList';
import AdminProfile from '@/components/AdminProfile';

const { Title, Text } = Typography;

const manage = () => {
    const [activeSection, setActiveSection] = useState(null);
    return (
        <AppLayout>
            {/* 상단 프로필 카드 */}
            <AdminProfile showManageButtons={true} onSectionChange={setActiveSection} />

            {/* 조건부로 보여줄 컴포넌트들 */}
            {activeSection === 'prize' && <PrizeManage />}
            {activeSection === 'category' && <CategoryManage />}
            {activeSection === 'schedule' && <EventScheduleList />}
            {activeSection === 'challenge' && <ChallengeList />}
            {/* 다른 섹션도 여기에 조건부로 추가 가능 */}
        </AppLayout>);
}
////////////////////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    //1. cookie 설정
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) { axios.defaults.headers.Cookie = cookie; }

    //2. redux 액션
    context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    context.store.dispatch(END);

    await context.store.sagaTask.toPromise();

});
////////////////////////////////////////////////////////
export default manage;