// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  startAfter,
  limit,
  doc,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
  measurementId: "measurementId",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage(app);
export const logout = () => signOut(auth);
export const verification = () => sendEmailVerification(auth.currentUser);
export const sendpassword = (email) => sendPasswordResetEmail(auth, email);
export const getToken = () => auth.currentUser.getIdToken(true);

export const time = () => serverTimestamp();
export const updatingUser = (data) => updateProfile(auth.currentUser, data);

export const uploadFile = (childpath, file) => {
  const storageRef = ref(storage, childpath);
  return uploadBytes(storageRef, file);
};
export const deleteFile = (childpath) => {
  const storageRef = ref(storage, childpath);
  return deleteObject(storageRef);
};
export const getRefFile = (childpath) => ref(storage, childpath);
export const getDownload = getDownloadURL;
export const simpleUrlFile = (childpath) => getDownload(getRefFile(childpath));

export const queryFirestore = query;

export const registered = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signed = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const authchanged = (callback) => onAuthStateChanged(auth, callback);
export const google = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const addData = async (table, data) =>
  addDoc(collection(db, table), data);
export const setData = async (table, id, data) =>
  setDoc(doc(db, table, id), data);
export const getData = (table) => getDocs(collection(db, table));
export const getDocsData = (table, id) => getDoc(doc(db, table, id));
export const updateData = (table, id, data) =>
  updateDoc(doc(db, table, id), data);
export const deleteData = (table, id) => deleteDoc(doc(db, table, id));
export const paginateData = (table, limit, query, last = false) => {
  if (!last) {
    const first = query(collection(db, table), query());
    return getDocs(first);
  } else {
    // const lastVisible = last /*snapshot.docs[snapshot.docs.length-1];*/
    const lastVisible = last;
    const next = query(
      collection(db, table),
      orderBy("population"),
      startAfter(lastVisible),
      limit(limit)
    );
    return next;
  }
};
