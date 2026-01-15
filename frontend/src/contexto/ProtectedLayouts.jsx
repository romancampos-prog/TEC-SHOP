import { Outlet } from "react-router-dom";
import { AuthProvider } from "./user.Context";
import RutaProtegida from "../routes/RutaProtegida";

export default function ProtectedLayout() {
  return (
    <AuthProvider>
      <RutaProtegida>
        <Outlet />
      </RutaProtegida>
    </AuthProvider>
  );
}
