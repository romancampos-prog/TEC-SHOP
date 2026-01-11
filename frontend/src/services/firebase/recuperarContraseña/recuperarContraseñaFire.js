import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase.config";

const auth = getAuth(app);

export const recuperarContrasenaFirebase = async (email) => {
  const actionCodeSettings = {
    url: "https://tec-shop-4b242.web.app/",
    handleCodeInApp: true,
  };

  return sendPasswordResetEmail(auth, email, actionCodeSettings);
};
