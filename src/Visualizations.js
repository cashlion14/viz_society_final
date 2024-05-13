import './utilities.css'
import React, {useEffect, useRef, useState} from "react";
import Map from "./map.jsx";
import NeighborhoodVisualizations from './NeighborhoodVisualizations';
import TimeSlider from "./timeSlider";


const Visualizations = () => {
    const [hoveredData, setHoveredData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2020);
    const [selectedEthnicity, setSelectedEthnicity] = useState('corp_own_rate');
    const ethnicityColorMapping = {
        corp_own_rate: '#E230A8',
        own_occ_rate: '#1a1',
        perc_white: '#A72608', // Red
        perc_black: '#566C2C', // Light green
        perc_aapi: '#3A481E', // Green
        // perc_hispanic: '#EC9192', // Pink
        perc_other: '#EC9192', // Grey
        perc_two_or_more: '#000' // Grey for multiracial and two or more (or define another color)
    };
    const handleNeighborhoodHover = (data) => {
        setHoveredData(data);
    };

    return (
        <div>
                <TimeSlider
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    ethnicityColorMapping={ethnicityColorMapping}
                    selectedEthnicity={selectedEthnicity}
                />
            <div className="visualizations">
                <div className="primary-viz-content">
                    <Map onNeighborhoodHover={handleNeighborhoodHover}
                         ethnicityColorMapping={ethnicityColorMapping}
                         selectedEthnicity={selectedEthnicity}
                         setSelectedEthnicity={setSelectedEthnicity}
                         selectedYear={selectedYear}
                         setSelectedYear={setSelectedYear}/>
                </div>
                <div className="secondary-viz-content">
                    <NeighborhoodVisualizations data={hoveredData}/>
                </div>
            </div>
        </div>
    )
}

export default Visualizations