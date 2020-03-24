// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app"
// const admin = require('admin-firebase');

// Add the Firebase services that you want to use
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDHOPTNmnpOqS2j1hYE5SPcvT2yQx7VAk0",
    authDomain: "classmaster-58e68.firebaseapp.com",
    databaseURL: "https://classmaster-58e68.firebaseio.com",
    projectId: "classmaster-58e68",
    storageBucket: "classmaster-58e68.appspot.com",
    messagingSenderId: "483431850020",
    appId: "1:483431850020:web:68cd083ebd13a1b5b3b8b1",
    measurementId: "G-24LKBLSF8N"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

  export default firebase;