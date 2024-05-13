import React from 'react';

const NeighborhoodEthnicityVisualizations = ({ethnicityColorMapping, data}) => {

        const nameMapping = {
            perc_black: 'Black', // Light green
            perc_hisp: 'Hispanic', // Pink
            perc_aapi: 'AAPI', // Green
            perc_white: 'White', // Red
            perc_other: 'Other', // white
            perc_two_or_more: 'Multiracial' //white
        }

        if (!data) {
            return <div>Hover over a neighborhood to explore the ethnicities and racial groups that live there.</div>;
        }
        if (!Object.keys(data).length) {
            return <div>Data is not available for the hovered neighborhood.</div>;
        }
        console.log("EOFEOIEOIE");
        console.log("JIJIJ", data);

        const total = Object.entries(data)
            .filter(([key, _]) => nameMapping.hasOwnProperty(key) && ethnicityColorMapping.hasOwnProperty(key))
            .reduce((acc, [key, value]) => acc + parseFloat(value, 10), 0);

        console.log("TOTAL", total);
        const getDotsForEthnicities = () => {
            const dots = [];
            let totalDots = 0;
            const entries = Object.entries(data)
                .filter(([key, _]) => ethnicityColorMapping.hasOwnProperty(key));

            const dotCounts = entries.map(([key, value]) => {
                const proportion = parseFloat(value) / total;
                const dotCount = Math.floor(proportion * 100);
                totalDots += dotCount;
                return {key, dotCount, remainder: (proportion * 100) - dotCount};
            });

            // Adjust for rounding errors by adding dots to entries with the largest remainders until we reach 100
            const remaindersSorted = dotCounts.sort((a, b) => b.remainder - a.remainder);
            for (let i = 0; totalDots < 100; i++, totalDots++) {
                remaindersSorted[i % remaindersSorted.length].dotCount++;
            }

            const sortedDotCounts = dotCounts.sort((a, b) => {
                const keys = Object.keys(ethnicityColorMapping);
                return keys.indexOf(a.key) - keys.indexOf(b.key);
            });

            // Generate the dot elements
            sortedDotCounts.forEach(({key, dotCount}) => {
                const color = ethnicityColorMapping[key];
                for (let i = 0; i < dotCount; i++) {
                    dots.push(
                        <div key={`${key}-${i}`} style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            margin: '1px',
                            display: 'inline-block'
                        }}/>
                    );
                }
            });
            return dots;
        };


        return (
            <div>
                <h2>{data.Neighborhood} Information</h2>
                <div style={{marginBottom: '5px', textAlign: 'left', color: 'white'}}>
                    <b>ETHNICITY BREAKDOWN:</b>
                    <p>Each dot represents 1% of the population within {data.Neighborhood}'s
                        neighborhood.</p>
                </div>
                <div className="circles-column">
                    {Object.entries(data).filter(([key, _]) => ethnicityColorMapping.hasOwnProperty(key)).map(([key, value]) => (
                        <div key={key}
                             style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px'}}>
                            <div className={`circle`} style={{
                                backgroundColor: ethnicityColorMapping[key],
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                marginRight: '10px'
                            }}/>
                            <span style={{color: 'white', marginRight: '10px'}}>
                            {nameMapping[key]}:
                        </span>
                            <span>{Math.round(value * 100) / 100}%</span>
                        </div>
                    ))}
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', width: '280px'}}>
                    {getDotsForEthnicities()}
                </div>
            </div>
        );
    }
;

export default NeighborhoodEthnicityVisualizations;