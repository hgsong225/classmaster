/* 글로벌 state, props 하고 싶을 때 ㄱㄱ */
import App from 'next/app'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import firebase from '../configure/firebase'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/root.css'

function classmaster_App({ Component, pageProps, userProp }) {
	const router = useRouter();
	const db = firebase.firestore();
	const provider = new firebase.auth.GoogleAuthProvider();
	const [ uid, setUID ] = useState(null)
	const [ user, setUser ] = useState({
		displayName: null,
		email: null,
		emailVerified: null,
		photoURL: null,
		isAnonymous: null,
		uuid: null,
		providerData: null,
	})
	const [ membership, setMembership ] = useState({
		expiration: null,
		payment_amount: null,
		payment_date: null,
		started: null,
		type: null,
		uuid: null,
		membership_id: null,
	})

    useEffect(() => {
      async function fetchData() {
        await firebase.auth().onAuthStateChanged((user) => {
          let userData = {
            displayName: null,
            email: null,
            emailVerified: null,
            photoURL: null,
            isAnonymous: null,
            uuid: null,
            providerData: null,
          };

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
			  setUID(userData.uuid);
  
              // ...
          } else {
              // User is signed out.
              console.log(`로그아웃 상태임`);
              setUser(userData);
              // ...
          }
          // ...
		});

		/* get membership snapshot in real-time */
		// await db.collection('membership').where('uuid', '==', uid)
		// 	.onSnapshot(async data => {
		// 		setMembership(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))[0])
				
		// 		let hasMembership = data.docs.length > 0 ? true : false
		// 		if (!hasMembership && (uid !== null)) {
		// 			addDefaultMembership(uid)
		// 		}
		// 	})
	  
	}


      fetchData()
	}, [uid])
	
	const getMembership = (uuid) => {
		db.collection('membership').where('uuid', '==', uuid)
		.get()
		.then(data => {
			let hasMembership = data.docs.length > 0 ? true : false
			if (!hasMembership && (uuid !== null)) {
				addDefaultMembership(uuid)
			} else {
				setMembership(data.docs.map(doc => ({ ...doc.data(), membership_id: doc.id }))[0])
			}
		})
	}

    const addDefaultMembership = (uuid) => {
		let defaultMembership = {
			expiration: null,
			payment_amount: null,
			payment_date: null,
			started: null,
			type: 'basic',
			uuid,
		}
		db.collection('membership')
			.add(defaultMembership)
			.then(doc => {
				setMembership(Object.assign({ membership_id: doc.id }, defaultMembership))
			})
			.catch(err => console.log('멤버십 추가 실패', err))
	}
	
	const updateMembership = (uuid) => {
		// newmembership 고쳐야함
		let newMembership = {
			expiration: null,
			payment_amount: null,
			payment_date: null,
			started: null,
			type: 'basic',
			uuid,
		}
		db.collection('membership').where('uuid', '==', uuid)
			.update(newMembership)
			.then(res => {
				console.log('멤버십 업데이트 완료')
			})
			.catch(err => console.log('멤버십 업데이트 실패', err))
    }

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
			getMembership(userData.uuid)
			router.push('/')
          
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
		membership={membership}
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