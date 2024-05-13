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
    const [specificYearData, setSpecificYearData] = useState(null);

    //TODO: change colors
    const ethnicityColorMapping = {
        perc_white: '#A72608', // Red
        perc_black: '#566C2C', // Light green
        perc_aapi: '#3A481E', // Green
        perc_hisp: '#EC9192', // Pink
        perc_other: '#D9D9D9', // Grey
        perc_two_or_more: '#D9D9D9' // Grey for multiracial and two or more (or define another color)
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
    const neighborhoodData = hoveredData && specificYearData && specificYearData.find(data =>
        data.Neighborhood === hoveredData.properties?.blockgr2020_ctr_neighb_name
    );

    return (
        <div className="visualizations">
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
                <div className="primary-viz-content">
                    <Map onNeighborhoodHover={handleNeighborhoodHover}
                            scenarioColorMapping={scenarioColorMapping}
                            selectedEthnicity={selectedDropdownFeature}
                            setSelectedEthnicity={setSelectedDropdownFeature}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedState={selectedState}
                            specificYearData={specificYearData}
                            setSpecificYearData={setSpecificYearData}
                    />
                </div>
            </div>
            <div className="secondary-viz-content">
                <NeighborhoodEthnicityVisualizations
                    ethnicityColorMapping={ethnicityColorMapping}
                    data={neighborhoodData}/>
            </div>
        </div>
    )
}

export default Visualizations