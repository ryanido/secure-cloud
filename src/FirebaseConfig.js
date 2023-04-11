import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCDqPqRRgr4Jrtr1803_u2iqYRR7xkWRNQ",
  authDomain: "cloud-5ea4f.firebaseapp.com",
  projectId: "cloud-5ea4f",
  storageBucket: "cloud-5ea4f.appspot.com",
  messagingSenderId: "913750917546",
  appId: "1:913750917546:web:d3978c9a62c25a7962ebd3",
  measurementId: "G-W1Q5TX069L"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
export const auth = getAuth(fb)