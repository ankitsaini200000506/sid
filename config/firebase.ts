import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxEpJnJKJXx4cL9BsLNlwNjZCMqw9TdpA",
  authDomain: "siddhi-restaurant.firebaseapp.com",
  databaseURL: "https://siddhi-restaurant-default-rtdb.firebaseio.com/",
  projectId: "siddhi-restaurant",
  storageBucket: "siddhi-restaurant.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, database, storage };