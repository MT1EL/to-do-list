import { initializeApp } from "firebase/app";
import { get, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAmVHXAh2K_RxeO5iNrZ2kBfYqI-l7x1Zk",
  authDomain: "to-do-list-a3f38.firebaseapp.com",
  projectId: "to-do-list-a3f38",
  storageBucket: "to-do-list-a3f38.appspot.com",
  messagingSenderId: "301584861474",
  appId: "1:301584861474:web:62518d6efc563d8abebd7b",
};
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
