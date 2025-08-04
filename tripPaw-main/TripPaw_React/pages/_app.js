// pages/_app.js
import { useEffect } from 'react';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import wrapper from '../store/configureStore';
import 'antd/dist/antd.css';

const Ssdam = ({ Component, pageProps }) => {
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=dd83c711edfa536595c191a7a73247a9&autoload=false&libraries=services,clusterer,drawing`;
      script.async = true;
      script.onload = () => window.kakao.maps.load(() => { });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <CookiesProvider>
      <Head>
        <meta charSet="utf-8" />
        <title>TripPaw</title>
        <link rel="icon" type="image/jpeg" href="/image/other/header.jpg?v=1" />
      </Head>
      <Component {...pageProps} />
    </CookiesProvider>
  );
};

export default wrapper.withRedux(Ssdam);
