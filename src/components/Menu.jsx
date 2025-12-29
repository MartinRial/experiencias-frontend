import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/user/userSlice";
import "../styles/Menu.css";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice || {});
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-logo">
          <NavLink to="/dashboard">Experiencias.uy</NavLink>
        </div>

        <ul className="nav-links">

    
         {role === "creator" && (
  <>
    <li>
      <NavLink to="/dashboard/agregar" className={({isActive}) => isActive ? "menu-link menu-link-active" : "menu-link"}>
        Agregar
      </NavLink>
    </li>
    <li>
      <NavLink to="/dashboard/mis-experiencias" className={({isActive}) => isActive ? "menu-link menu-link-active" : "menu-link"}>
        Mis Experiencias
      </NavLink>
    </li>
  </>
)}


          {role === "user" && (
            <>
              <li>
                <NavLink to="/dashboard" end className={({isActive}) => isActive ? "menu-link menu-link-active" : "menu-link"}>
                  Explorar
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/bookings" className={({isActive}) => isActive ? "menu-link menu-link-active" : "menu-link"}>
                  Bookings
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Menu;