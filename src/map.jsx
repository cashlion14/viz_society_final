import React, {useEffect, useRef, useState} from 'react';
import * as maptilersdk from '@maptiler/sdk';
import {csvParse} from 'd3-dsv';
import {scaleSequential} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {GradientBar} from './GradientBar';
import TimeSlider from './timeSlider';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import HoverBox from "./hoverBox";

export default function Map({ onNeighborhoodHover }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [specificYearData, setSpecificYearData] = useState(null);
    const [zoom] = useState(12);
    const [selectedEthnicity, setSelectedEthnicity] = useState('perc_white');
    const [maxEthnicityValue, setMaxEthnicityValue] = useState(0);
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [selectedYear, setSelectedYear] = useState(2020);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef();
    const dataLength = 2050 - 2004 + 1;
    const boston = {lng: -71.0589, lat: 42.3601};
    const bostonBounds = [
        [-71.291421, 42.127797],  // Southwest coordinates
        [-70.886004, 42.499542]   // Northeast coordinates
    ];
    maptilersdk.config.apiKey = '37cqcVAKPgwCo3fuGPSy';

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

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setSelectedYear(prevYear => {
                    let nextYear = prevYear + 1;
                    if (nextYear > 2050) {
                        nextYear = 2004;  // Loop back to start
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

    useEffect(() => {
        if (!map.current || !geojsonData) return;

        // Add event listener for mouseenter to each neighborhood feature
        map.current.on('mousemove', 'neighborhoods-fill', handleMouseMove);
        // Add event listener for mouseleave to each neighborhood feature
        map.current.on('mouseleave', 'neighborhoods-fill', handleMouseLeave);

        return () => {
            // Remove event listeners when component unmounts
            map.current.off('mousemove', 'neighborhoods-fill', handleMouseMove);
            map.current.off('mouseleave', 'neighborhoods-fill', handleMouseLeave);
        };
    }, [geojsonData, map.current]);

    useEffect(() => {
        if (csvData && csvData.length > 0) { // Ensure csvData is loaded and is not empty
            const filteredData = csvData.filter(d => d.Year === String(selectedYear));
            console.log("CSV", selectedYear, "Data:", filteredData);
            setSpecificYearData(filteredData);
        }
    }, [csvData, selectedYear]);


    useEffect(() => {
        if (map.current) return; // prevents map from initializing more than once

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS.DARK,
            center: [boston.lng, boston.lat],
            zoom: zoom,
            minZoom: 8, // how far out (can see whole Boston)
            maxZoom: 14, // how close to get
            maxBounds: bostonBounds
        });

        map.current.once('load', fetchData);
    }, [selectedYear]);

    useEffect(() => {
        if (!map.current || !geojsonData || !csvData) return; // Ensure the map and data are loaded
        addNeighborhoodsLayer(selectedEthnicity, geojsonData, specificYearData);
    }, [selectedEthnicity, geojsonData, csvData, specificYearData]); // Re-run when ethnicity or data changes

    const handleMouseMove = (event) => {
        if (event.features.length === 0) {
            clearHoverState();
            return;
        }
        const newHoveredFeature = event.features[0];
        const featureId = newHoveredFeature.id;

        if (!hoveredFeature || hoveredFeature.id !== featureId) {
            // Reset previous hover state if exists
            if (hoveredFeature) {
                map.current.setFeatureState(
                    {source: 'neighborhoods', id: hoveredFeature.id},
                    {hover: false}
                );
            }

            // Set new hover state
            map.current.setFeatureState(
                {source: 'neighborhoods', id: featureId},
                {hover: true}
            );

            setHoveredFeature({...newHoveredFeature.properties, id: featureId});
            console.log("NHF:", newHoveredFeature)
            onNeighborhoodHover(newHoveredFeature.properties);
        }

        setMousePosition({x: event.point.x, y: event.point.y});
    }


    const handleMouseLeave = (event) => {
        clearHoverState();
    };

    const clearHoverState = () => {
        if (hoveredFeature) {
            map.current.setFeatureState(
                {source: 'neighborhoods', id: hoveredFeature.id},
                {hover: false}
            );
            map.current.setPaintProperty('neighborhoods-fill', 'fill-color', ['get', 'color']);
            setHoveredFeature(null);
            setMousePosition({x: 0, y: 0});
        }
    };

    const fetchData = () => {
        fetch('/data/Boston_Neighborhoods.geojson')
            .then(response => response.json())
            .then(data => {
                data.features.forEach((feature, index) => {
                    feature.id = feature.id || index;
                });
                setGeojsonData(data);
                fetch('/data/all_data_2004_to_2050.csv')
                    .then(response => response.text())
                    .then(csvText => {
                        const parsedCsvData = csvParse(csvText);
                        console.log("CSV Data:", parsedCsvData);
                        console.log("Geo Data:", data);
                        setCsvData(parsedCsvData);
                        const filteredData = parsedCsvData.filter(d => d.Year === String(selectedYear));
                        console.log("CSV 2020 Data:", filteredData);
                        setSpecificYearData(filteredData);
                    });
            });
    }
    const getMonochromeColor = (value, minValue, maxValue, color) => {
        // Create a scale that returns a color based on the input value
        const scale = scaleSequential(interpolateRgb(`#ffffff`, color)).domain([minValue, maxValue]);
        return scale(value);
    };
    const addNeighborhoodsLayer = (selectedEthnicity, geojsonData, year2020Data) => {
        // Find min and max values for the selected ethnicity for proper scaling
        const values = specificYearData.map(d => parseFloat(d[selectedEthnicity]));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        setMaxEthnicityValue(maxValue);

        const baseColor = ethnicityColorMapping[selectedEthnicity] || '#FFFFFF';

        geojsonData.features.forEach((feature, index) => {
            feature.id = feature.id || index;
            const neighborhoodData = specificYearData.find(d =>
                d.Neighborhood === feature.properties.blockgr2020_ctr_neighb_name);
            feature.properties.value = neighborhoodData ? parseFloat(neighborhoodData[selectedEthnicity]) : 0;
            feature.properties.color = getMonochromeColor(feature.properties.value, minValue, maxValue, baseColor);
        });

        if (!map.current.getSource('neighborhoods')) {
            map.current.addSource('neighborhoods', {
                type: 'geojson',
                data: geojsonData
            });
        } else {
            map.current.getSource('neighborhoods').setData(geojsonData);
        }

        addOrUpdateLayers();
        let hoveredNeighborhoodId = null;
        map.current.on('mousemove', 'neighborhoods-fill', (e) => {
            if (e.features.length > 0) {
                const currentHoverId = e.features[0].id;
                if (hoveredNeighborhoodId !== currentHoverId) {
                    if (hoveredNeighborhoodId !== null) {
                        map.current.setFeatureState(
                            {source: 'neighborhoods', id: hoveredNeighborhoodId},
                            {hover: false}
                        );
                    }
                    hoveredNeighborhoodId = currentHoverId;
                    map.current.setFeatureState(
                        {source: 'neighborhoods', id: hoveredNeighborhoodId},
                        {hover: true}
                    );
                }
            }
        });

        map.current.on('mouseleave', 'neighborhoods-fill', () => {
            if (hoveredNeighborhoodId !== null) {
                map.current.setFeatureState(
                    {source: 'neighborhoods', id: hoveredNeighborhoodId},
                    {hover: false}
                );
                hoveredNeighborhoodId = null;
                clearInformationDisplay();
            }
        });

        // After adding the layers, update them with the right colors
        geojsonData.features.forEach(feature => {
            const color = getMonochromeColor(feature.properties.value, minValue, maxValue);
            map.current.setFeatureState(
                {source: 'neighborhoods', id: feature.id},
                {color: color}
            );
        });
    }

    function addOrUpdateLayers() {
        // Initialize or update fill, outline, and label layers
        if (!map.current.getLayer('neighborhoods-fill')) {
            map.current.addLayer({
                id: 'neighborhoods-fill',
                type: 'fill',
                source: 'neighborhoods',
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        'rgba(0, 0, 0, 1)',  // White tint if hovered
                        ['get', 'color']  // Original color from feature properties
                    ],
                    'fill-opacity': 0.75
                }
            });
        }

        if (!map.current.getLayer('neighborhoods-outline')) {
            map.current.addLayer({
                id: 'neighborhoods-outline',
                type: 'line',
                source: 'neighborhoods',
                paint: {
                    'line-color': '#aaa',
                    'line-width': 3
                }
            });
        }

        if (!map.current.getLayer('neighborhoods-labels')) {
            map.current.addLayer({
                id: 'neighborhoods-labels',
                type: 'symbol',
                source: 'neighborhoods',
                layout: {
                    'text-field': ['get', 'blockgr2020_ctr_neighb_name'],
                    'text-variable-anchor': ['center'],
                    'text-radial-offset': 0,
                    'text-justify': 'center',
                    'text-size': 15
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': '#000000',
                    'text-halo-width': 2,
                    'text-halo-blur': 1
                }
            });
        }
    }


    function clearInformationDisplay() {
        setHoveredFeature(null);
    }

    return (
            <div className="map-wrap">
            <select className="map-overlay" value={selectedEthnicity}
                    onChange={e => setSelectedEthnicity(e.target.value)}>
                <option value="corp_own_rate">Corporation Ownership Rate</option>
                <option value="own_occ_rate">Ownership Occupation Rate</option>
                <option value="perc_aapi">Percentage AAPI</option>
                <option value="perc_black">Percentage Black</option>
                <option value="perc_white">Percentage White</option>
                <option value="perc_other">Percentage Other</option>
                <option value="perc_two_or_more">Percentage Two or More</option>
            </select>
            <div ref={mapContainer} className="map"/>
            <GradientBar color={ethnicityColorMapping[selectedEthnicity] || '#FFFFFF'}/>
            <div className="flex-container" style={{
                display: 'flex',       // Enables flexbox layout
                alignItems: 'center', // Vertically aligns items in the center
                marginLeft: '235px'
            }}>
                <button onClick={handlePlayPause} style={{
                    marginTop: '5px',  // Adds space between button and slider
                    padding: '5px 15px', // Adjusts padding for better visual appeal
                    fontSize: '16px',     // Ensures text size is appropriate
                    cursor: 'pointer',     // Changes cursor to pointer on hover
                    zIndex: 1000
                }}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <TimeSlider
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    ethnicityColorMapping={ethnicityColorMapping}
                    selectedEthnicity={selectedEthnicity}
                />
            </div>
            <HoverBox
                hoveredFeature={hoveredFeature}
                mousePosition={mousePosition}
                specificYearData={specificYearData}
                selectedEthnicity={selectedEthnicity}
            />
            </div>

    );
}

