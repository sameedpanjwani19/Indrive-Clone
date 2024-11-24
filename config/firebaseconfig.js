import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCNy0dxQ_HDuePqtWBvcVGUIwaopKPQXFI",
  authDomain: "indive-clone.firebaseapp.com",
  projectId: "indive-clone",
  storageBucket: "indive-clone.firebasestorage.app",
  messagingSenderId: "1085482144025",
  appId: "1:1085482144025:web:b51fa990ae33069a457588",
  measurementId: "G-VCKLXSTH8Y"
};



const app = initializeApp(firebaseConfig);
export default app