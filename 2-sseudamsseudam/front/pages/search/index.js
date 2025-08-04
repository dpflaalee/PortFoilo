import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import 'antd/dist/antd.css';

import axios from "axios";
import wrapper from "@/store/configureStore";
import { END } from "redux-saga";
import { LOAD_BLOCK_REQUEST } from "@/reducers/user";
import { LOAD_MY_INFO_REQUEST } from "@/reducers/user";

import SearchForm from "@/components/search/SearchForm";

const Search = () => {


    return (
        <AppLayout>
            <>
                <SearchForm />
            </>
        </AppLayout >
    );
}
///////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    //1. cookie 설정
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) { axios.defaults.headers.Cookie = cookie; }

    //2. redux 액션
    context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    context.store.dispatch({ type: LOAD_BLOCK_REQUEST });

    context.store.dispatch(END);

    await context.store.sagaTask.toPromise();

});
/////////////////////////
export default Search;
