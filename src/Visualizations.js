import './utilities.css'
import React, {useState} from "react";
import Map from "./map.jsx";
import NeighborhoodEthnicityVisualizations from './NeighborhoodEthnicityVisualizations';
import TimeSlider from "./timeSlider";
import SelectStateButtons from "./SelectStateButtons";


const Visualizations = () => {
    const [hoveredData, setHoveredData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedDropdownFeature, setSelectedDropdownFeature] = useState('corp_own_rate');
    const [selectedState, setSelectedState] = useState('realistic');
    const ethnicityColorMapping = {
        corp_own_rate: 'forestgreen',
        own_occ_rate: 'gold',
        perc_white: '#A72608', // Red
        perc_black: '#566C2C', // Light green
        perc_aapi: '#3A481E', // Green
        // perc_hispanic: '#EC9192', // Pink
        perc_other: '#EC9192', // Grey
        perc_two_or_more: '#000' // Grey for multiracial and two or more (or define another color)
    };
    const scenarioColorMapping =
        {
            pessimistic: 'darkred',
            realistic: 'gold',
            optimistic: 'forestgreen'
        };

    const handleNeighborhoodHover = (data) => {
        setHoveredData(data);
    };

    return (
        <div>
            <div className="viz-controls"
                 style={{
                     display: 'flex',        // Use flexbox to align children inline
                     justifyContent: 'left', // Horizontally center the content
                     gap: '20px'             // Space between the TimeSlider and SelectStateButtons
                 }}>
                <TimeSlider
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    scenarioColorMapping={scenarioColorMapping}
                    selectedState={selectedState}
                />
                <SelectStateButtons
                    selectedState={selectedState} setSelectedState={setSelectedState}
                    scenarioColorMapping={scenarioColorMapping}/>
            </div>
            <div className="visualizations">
                <div className="primary-viz-content">
                    <Map onNeighborhoodHover={handleNeighborhoodHover}
                         scenarioColorMapping={scenarioColorMapping}
                         selectedEthnicity={selectedDropdownFeature}
                         setSelectedEthnicity={setSelectedDropdownFeature}
                         selectedYear={selectedYear}
                         setSelectedYear={setSelectedYear}
                         selectedState={selectedState}
                    />
                </div>
                <div className="secondary-viz-content">
                    <NeighborhoodEthnicityVisualizations data={hoveredData}/>
                </div>
            </div>
        </div>
    )
}

export default Visualizations