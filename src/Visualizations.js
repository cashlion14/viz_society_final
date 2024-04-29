import './utilities.css'
import React from "react";
import Map from "./map.jsx";


const Visualizations = () => {
    return (
        <div className="visualizations">
            <div className="primary-viz-content">
                <Map/>
            </div>
            <div className="secondary-viz-content">
                <div className="barchart-viz" style={{marginBottom: '25px'}}>
                  Insert Barchart 1 Here
                </div>
                <div className="barchart-viz" style={{marginTop: '25px'}}>
                  Insert Barchart 2 Here
                </div>
            </div>
        </div>
    )
}

export default Visualizations