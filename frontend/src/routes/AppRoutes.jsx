import { BrowserRouter, Routes, Route } from "react-router-dom";
import Ejemplo1 from "../pages/ejmplo1";
import Ejemplo2 from "../pages/ejemplo2";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Ejemplo1></Ejemplo1>}></Route>
                <Route path="/ejemplo1Page" element={<Ejemplo1></Ejemplo1>}></Route>
                <Route path="/ejemplo2Page" element={<Ejemplo2></Ejemplo2>}></Route>                
            </Routes>
        </BrowserRouter>
    )
}