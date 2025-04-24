import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ5p0ZiakIeVfUIaJ1Lwg7XBgI70EBeQo",
  authDomain: "tarrify-suite.firebaseapp.com",
  projectId: "tarrify-suite",
  storageBucket: "tarrify-suite.appspot.com",
  messagingSenderId: "837411721992",
  appId: "1:837411721992:web:bfdee83034b84ad5a3d2bd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
