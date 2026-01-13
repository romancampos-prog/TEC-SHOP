import { getAuth, signOut } from "firebase/auth";
import {app} from "../firebase.config"



export const cerrarSesionFirebase = async () => {
    const auth = getAuth(app);
    await signOut(auth);
}