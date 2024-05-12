import './utilities.css'
import React, {useState} from "react";
import Map from "./map.jsx";
import NeighborhoodVisualizations from './NeighborhoodVisualizations';


const Visualizations = () => {
    const [hoveredData, setHoveredData] = useState(null);

    const handleNeighborhoodHover = (data) => {
        setHoveredData(data);
    };
    return (
        <div className="visualizations">
            <div className="primary-viz-content">
                <Map onNeighborhoodHover={handleNeighborhoodHover} />
            </div>
            <div className="secondary-viz-content">
                <NeighborhoodVisualizations data={hoveredData}/>
            </div>
        </div>
    )
}

export default Visualizations