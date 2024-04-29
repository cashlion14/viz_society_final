import Navbar from './Navbar.js'; // Import the Navbar component
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from './placeholder.png';
import './utilities.css'
import Map from "./map.jsx";
import Visualizations from './Visualizations.js'
import About from './About.js'
import { initializeMap } from "./swipeMap";
import React, { useState, useEffect } from "react";

const MainPage = () => {
  // useEffect(() => {
  //     initializeMap();
  // }, []);

  const [activePage, setActivePage] = useState('visualizations');

  return (
    <div className="main">
        <Navbar setActivePage={setActivePage}/>
        <div className="main">
          {activePage === 'visualizations' && <Visualizations />}
          {activePage === 'about' && <About />}
        </div>
    </div>
  );
};

export default MainPage;