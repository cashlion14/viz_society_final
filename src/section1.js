import React from 'react';
import Navbar from './Navbar.js'; // Import the Navbar component
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from './placeholder.png';
import './fonts.css'

const section1 = () => {
  return (
    <div className="section">
        <Navbar />
        <div className="main">
            <h2>Welcome to Eat the Rich</h2>
            <div className="primary-viz-content">
                <img src={myImage} alt="" style={{ width: '700px', height: 'auto'}}/>
            </div>
        </div>
    </div>
  );
};

export default section1;