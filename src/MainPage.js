import Navbar from './Navbar.js'; // Import the Navbar component
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from './placeholder.png';
import './utilities.css'
import Map from "./map.jsx";
import { initializeMap } from "./swipeMap";
import React, { useState, useEffect } from "react";


const MainPage = () => {
  // useEffect(() => {
  //     initializeMap();
  // }, []);

  return (
    <div className="main">
        <Navbar />
        <div className="main">
            <h2>Welcome to Eat the Rich</h2>
            <div className="primary-viz-content">
                <img src={myImage} alt="" style={{ width: '700px', height: 'auto'}}/>
                {/* <Map/>
                <div>
                   <input id="swipe" type="range" min="0" max="100" defaultValue="50"/>
                   <div id="map" style={{width: '800px', height: '600px'}}></div>
                </div> */}
            </div>
        </div>
    </div>
  );
};

export default MainPage;