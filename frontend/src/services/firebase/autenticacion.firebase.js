// src/services/firebase/auth.service.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase.config";

const auth = getAuth(app);

export const registrarUsuarioFirebase = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUsuarioFirebase = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
