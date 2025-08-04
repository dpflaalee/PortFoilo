import React, { useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import 'antd/dist/antd.css';
import { useSelector, useDispatch } from "react-redux";
import { LOAD_COMPLAIN_REQUEST } from "@/reducers/complain";
import { LOAD_MY_INFO_REQUEST } from "@/reducers/user";
import ComplainCard from "@/components/complains/ComplainCard";

import axios from 'axios';
import wrapper from '../../store/configureStore';
import { END } from 'redux-saga';

import AdminProfile from "@/components/AdminProfile";
import _ from 'lodash';

const ComplainPage = () => {
    const dispatch = useDispatch();
    const { mainComplainCard } = useSelector((state) => state.complain);

    useEffect(() => {
        dispatch({
            type: LOAD_COMPLAIN_REQUEST,
        });
    }, [dispatch]);

    // 신고 목록을 type + targetId 기준으로 묶기
    const grouped = _.groupBy(mainComplainCard, (r) => {
        const type = (r.targetType || '').toUpperCase();  // ← 핵심 수정
        const targetId = Number(r.targetId);
        return `${type}_${targetId}`;
    });


    const groupedCards = Object.entries(grouped);

    return (
        <AppLayout>
            <AdminProfile isComplain={true} />
            {groupedCards.map(([groupKey, reports]) => (
                <ComplainCard key={groupKey} reports={reports} />
            ))}
        </AppLayout>
    );
};
////////////////////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    //1. cookie 설정
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) { axios.defaults.headers.Cookie = cookie; }

    //2. redux 액션
    context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    context.store.dispatch({ type: LOAD_COMPLAIN_REQUEST });
    context.store.dispatch(END);

    await context.store.sagaTask.toPromise();

});
////////////////////////////////////////////////////////
export default ComplainPage;
