import React from 'react';

const HoverBox = ({ hoveredFeature, mousePosition, specificYearData, selectedEthnicity }) => {
    if (!hoveredFeature) return null;

    const style = {
        left: `${mousePosition.x + 10}px`, // 10px to the right of the cursor
        top: `${mousePosition.y + 10}px`  // 10px below the cursor
    };
    const neighborhoodData = specificYearData.find(d => d.Neighborhood === hoveredFeature?.blockgr2020_ctr_neighb_name)
    console.log("HB neighborhoodData:", neighborhoodData);
    return (
        <div className="hover-box" style={style}>
            <h3>{hoveredFeature.blockgr2020_ctr_neighb_name}</h3>
            <p>Corporate Ownership Rate: {neighborhoodData && neighborhoodData.corp_own_rate ? `${Math.round(neighborhoodData.corp_own_rate*100)/100} %` : 'Uncertain'}</p>
            <p>Owner Occupation Rate: {neighborhoodData && neighborhoodData.own_occ_rate ? `${Math.round(neighborhoodData.own_occ_rate*100)/100} %`: 'Uncertain'}</p>
        </div>
    );
};

export default HoverBox;
