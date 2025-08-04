import React, { Component } from "react";
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';   // 공통css
import Head from 'next/head';
import { Provider } from 'react-redux';
import wrapper from '../store/configureStore';
import { CookiesProvider } from "react-cookie";

const Ssdam = ({ Component }) => {
  return (
    <CookiesProvider>
      <Head>
        <meta charSet="utf-8" />
        <title>Ssdam</title>
      </Head>
      <Component />
    </CookiesProvider>
  );
};
Ssdam.propType = {
  Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(Ssdam);
