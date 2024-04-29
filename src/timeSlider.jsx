// YearSlider.js
import React from 'react';

const TimeSlider = ({ selectedYear, setSelectedYear, ethnicityColorMapping, selectedEthnicity }) => {
    return (
        <div className="year-slider" style={{marginLeft: '55px'}}>
            <input type="range"
                   min="2004"
                   max="2050"
                   value={selectedYear}
                   onChange={e => setSelectedYear(e.target.value)}
                   className="slider" />
            <p style={{
                fontSize: 20,
                fontWeight: "bold",
                backgroundColor: ethnicityColorMapping[selectedEthnicity] || '#FFFFFF'
            }}>
                Selected Year: {selectedYear}
            </p>
        </div>
    );
};

export default TimeSlider;
