import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDT6aTMdtWSoc8X62sCCqPH3VvKAKnKMc0",
  authDomain: "fir-shop-590fd.firebaseapp.com",
  projectId: "fir-shop-590fd",
  storageBucket: "fir-shop-590fd.appspot.com",
  messagingSenderId: "81540996428",
  appId: "1:81540996428:web:16489b1c1ef09a7c4f43e9",
});

export const auth = app.auth();
export const firestore = app.firestore();
export default app;
