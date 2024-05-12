import Navbar from './Navbar.js'; // Import the Navbar component
import 'bootstrap/dist/css/bootstrap.min.css';
import './utilities.css'
import Visualizations from './Visualizations.js'
import About from './About.js'
import React, { useState } from "react";

const MainPage = () => {

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