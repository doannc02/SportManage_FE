import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/navbar/Navbar";

function UserLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default UserLayout;
