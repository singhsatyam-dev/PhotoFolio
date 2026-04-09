// create and initialize your own firebase here
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHvLAe_GfRxECu7lTm1eoCZLNxRPChnBg",
  authDomain: "blogging-app-75fe4.firebaseapp.com",
  projectId: "blogging-app-75fe4",
  storageBucket: "blogging-app-75fe4.firebasestorage.app",
  messagingSenderId: "567206209814",
  appId: "1:567206209814:web:705dc17d81c6dffaf64837"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)