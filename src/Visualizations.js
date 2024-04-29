import './utilities.css'
import React from "react";


const Visualizations = () => {
    return (
        <div className="visualizations">
            <div className="primary-viz-content">
                Insert Primary Map Here
                {/* <Map/>
                <div>
                   <input id="swipe" type="range" min="0" max="100" defaultValue="50"/>
                   <div id="map" style={{width: '800px', height: '600px'}}></div>
                </div> */}
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