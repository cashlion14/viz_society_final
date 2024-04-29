import './utilities.css'
import React from "react";
import Map from "./map.jsx";
import image1 from './image1.png';
import image2 from './image2.png';


const Visualizations = () => {
    return (
        <div className="visualizations">
            <div className="primary-viz-content">
                <Map/>
            </div>
            <div className="secondary-viz-content">
                <div className="barchart-viz" style={{marginBottom: '25px'}}>
                  <img src={image1} alt="" style={{height: '250px', width: '450px'}}></img>
                </div>
                <div className="barchart-viz" style={{marginTop: '25px'}}>
                <img src={image2} alt="" style={{height: '250px', width: '450px'}}></img>
                </div>
            </div>
        </div>
    )
}

export default Visualizations