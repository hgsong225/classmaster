/* 글로벌 state, props 하고 싶을 때 ㄱㄱ */
import App from 'next/app'
import Head from 'next/head'
import { useState, useEffect } from 'react'

import firebase from '../configure/firebase'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/root.css'

function classmaster_App({ Component, pageProps }) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const [ user, setUser ] = useState(null)

    useEffect(() => {
      async function fetchData() {
        await firebase.auth().onAuthStateChanged((user) => {
          let userData = {};

          if (user) {
              // User is signed in.
              userData = {
                  displayName: user.displayName,
                  email: user.email,
                  emailVerified: user.emailVerified,
                  photoURL: user.photoURL,
                  isAnonymous: user.isAnonymous,
                  uuid: user.uid,
                  providerData: user.providerData,
              };
  
              setUser(userData);
  
              // ...
          } else {
              // User is signed out.
              console.log(`로그아웃 상태`);
              setUser(null);
              // ...
          }
          // ...
        });
      }

      fetchData()
    }, [])

    const handleSignIn = () => {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            // ...
            let userData = {};
            userData = {
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
              isAnonymous: user.isAnonymous,
              uuid: user.uid,
              providerData: user.providerData,
            };

            console.log('회원가입 완료맨', user)
          
        }).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            // ...
            console.log(errorCode, errorMessage, email)
        });
    }

    return <Component
        {...pageProps}
        user={user}
        handleSignIn={handleSignIn}
    />
}
  
//   Only uncomment this method if you have blocking data requirements for
//   every single page in your application. This disables the ability to
//   perform automatic static optimization, causing every page in your app to
//   be server-side rendered.
  
classmaster_App.getInitialProps = async (appContext) => {
// calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return {
      ...appProps,
  };
}
  
export default classmaster_App