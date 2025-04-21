import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4000";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();
  const login = async (data) => {
    // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    // Set state
    setState({ ...state, loading: true, error: null });

    try {
      // fetch API form /login
      const response = await axios.post(`${BASE_URL}/auth/login`, data);

      // check token
      if (!response.data.token) {
        throw new Error("Invalid username or password");
      }

      // save token to local storage
      const { token } = response.data;
      localStorage.setItem("token", token);

      // receive user data and save
      const userDatafromToken = jwtDecode(token);
      setState({ ...state, user: userDatafromToken });

      // redirect to home
      navigate("/");
    } catch (error) {
      // handle error
      setState({ ...state, loading: false, error: error.message });
      console.error("Login error:", error);
    }
  };

  const register = async (data) => {
    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    // Set state
    setState({ ...state, loading: true, error: null });
    
    try {
      // fetch API form /register
      const response = await axios.post(`${BASE_URL}/auth/register`, data);

      // redirect to login
      navigate("/login");
    } catch (error) {
      // handle error
      setState({ ...state, loading: false, error: error.message });
      console.error("Register error:", error);
    }
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage

    // Set state
    setState({ ...state, user: null });

    // remove token from local storage
    localStorage.removeItem("token");

    // redirect to login
    navigate("/login");
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };