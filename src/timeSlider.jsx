import './utilities.css'
import React, {useEffect, useRef, useState} from 'react';

const TimeSlider = ({selectedYear, setSelectedYear, scenarioColorMapping, selectedState}) => {
    const timerRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setSelectedYear(prevYear => {
                    let nextYear = prevYear + 1;
                    if (nextYear > 2050) {
                        nextYear = 2025;  // Loop back to start
                    }
                    // updateMapForYear(nextYear);
                    return nextYear;
                });
            }, 700); // Change the year every second
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isPlaying]);
    return (
        <div className="year-slider" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '0px' }}>
            <p style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '0px',
                backgroundColor: scenarioColorMapping[selectedState] || '#FFFFFF',
                width: '100%',  // Ensure the label spans the full width
                textAlign: 'center' // Center text for better visual alignment
            }}>
                Selected Year: {selectedYear}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <button onClick={handlePlayPause} style={{
                    marginTop: '10px', // Reduces space between button and slider for tight grouping
                    padding: '5px 15px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: 1000
                }}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <input type="range"
                       style={{ width: '100%', height: '25px', flexGrow: 1, marginLeft: '10px' }} // Ensure slider takes the remaining space
                       min="2025"
                       max="2050"
                       value={selectedYear}
                       onChange={e => setSelectedYear(e.target.value)}
                       className="slider"/>
            </div>
        </div>
    );
};

export default TimeSlider;
