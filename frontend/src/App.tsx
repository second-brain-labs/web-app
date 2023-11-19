import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Shared/Footer';
import LoginPage from './auth/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from './auth/RegisterPage';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/createaccount" element={<RegisterPage/>}/>
        <Route path="/home" element={<><HomePage/> <Footer/></>}/>

        
      </Routes>
    </BrowserRouter>
      
  );
}

export default App;
