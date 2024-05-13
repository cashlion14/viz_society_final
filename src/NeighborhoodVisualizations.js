import React from 'react';

const NeighborhoodVisualizations = ({data}) => {
        const ethnicityColorMapping = {
            white_all: '#A72608', // Red
            black_all: '#566C2C', // Light green
            aapi_all: '#3A481E', // Green
            hisp_all: '#BC9192', // Pink
            other_all: '#EC9192', // Grey
            two_or_more_all: 'white' // Grey for multiracial and two or more (or define another color)
        };
        const nameMapping ={
            black_all: 'Black', // Light green
            hisp_all: 'Hispanic', // Pink
            aapi_all: 'AAPI', // Green
            white_all: 'White', // Red
            other_all: 'Multiracial/Other', // white
            two_or_more_all: 'Multiracial/Other' //white
        }

        if (!data) {
            return <div>Hover over a neighborhood to explore the ethnicities and racial groups that live there.</div>;
        }
        console.log("JIJIJ", data);
        const getDotsForEthnicity = (value, color) => {
            const numberOfDots = Math.floor(value / 500);
            const dots = [];
            for (let i = 0; i < numberOfDots; i++) {
                dots.push(<div key={i} style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    margin: '1px',
                    display: 'inline-block'
                }}/>);
            }
            return dots;
        };

        const entries = Object.entries(data).filter(([key, _]) => ethnicityColorMapping.hasOwnProperty(key));

        return (
            <div>
                <h2>{data.blockgr2020_ctr_neighb_name} Information</h2>
                <div style={{marginBottom: '5px', textAlign: 'left', color: 'white'}}>
                    <b>2020 ETHNICITY BREAKDOWN:</b>
                    <p>Each dot represents 500 individuals from their respective ethnicity.</p>
                </div>
                <div className="circles-column">
                    {entries.map(([key, value]) => (
                        <div key={key}
                             style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px'}}>
                            <div className={`circle`} style={{
                                backgroundColor: ethnicityColorMapping[key],
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                marginRight: '10px'
                            }}></div>
                            <span style={{color: 'white', marginRight: '10px'}}>
                                {nameMapping[key]}:
                    </span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {entries.flatMap(([key, value]) =>
                        getDotsForEthnicity(value, ethnicityColorMapping[key])
                            .map(dot => React.cloneElement(dot, {key: key + dot.key}))  // Ensure unique keys
                    )}
                </div>
            </div>
        );
    }
;


export default NeighborhoodVisualizations;