import App from 'next/app'
import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/root.css'

export default function classmaster_App({ Component, pageProps }) {
  return <Component {...pageProps} />
}