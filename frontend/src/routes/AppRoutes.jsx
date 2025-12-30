import { BrowserRouter, Routes, Route } from "react-router-dom";
import Incio_page from "../pages/inicio/inicio-page";
import Login from "../pages/login/Login";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/> 
                <Route path="/inicio" element={<Incio_page/>}/>           
            </Routes>
        </BrowserRouter>
    )
}