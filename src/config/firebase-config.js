import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC-D01dmcZf_Ru0WpBle6kpPz7raHBZDoQ",
    authDomain: "tasks-6b241.firebaseapp.com",
    projectId: "tasks-6b241",
    storageBucket: "tasks-6b241.appspot.com",
    messagingSenderId: "956287101440",
    appId: "1:956287101440:web:2c727d15ed3d40c62ac6e5"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

