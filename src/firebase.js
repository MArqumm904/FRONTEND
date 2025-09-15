import { initializeApp } from "firebase/app";
import { getDatabase, ref, onChildAdded } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAnr9NXqMq-6RPkPJksUyDjqLB1yBdsY8I",
  authDomain: "ahmeed-realtime-chat.firebaseapp.com",
  databaseURL: "https://ahmeed-realtime-chat-default-rtdb.firebaseio.com",
  projectId: "ahmeed-realtime-chat",
  storageBucket: "ahmeed-realtime-chat.firebasestorage.app",
  messagingSenderId: "548733619576",
  appId: "1:548733619576:web:d8e85b734bb4a4eb018c8d"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
