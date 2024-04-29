import React, {useEffect, useRef, useState} from 'react';
import * as maptilersdk from '@maptiler/sdk';
import {csvParse} from 'd3-dsv';
import {scaleSequential} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {GradientBar} from './GradientBar';
import TimeSlider from './timeSlider';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import tinycolor from 'tinycolor2';
import HoverBox from "./hoverBox";

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [specificYearData, setSpecificYearData] = useState(null);
    const [zoom] = useState(11);
    const [selectedEthnicity, setSelectedEthnicity] = useState('perc_aapi');
    const [maxEthnicityValue, setMaxEthnicityValue] = useState(0);
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedYear, setSelectedYear] = useState(2020);
    const boston = {lng: -71.0589, lat: 42.3601};
    maptilersdk.config.apiKey = '37cqcVAKPgwCo3fuGPSy';

    const ethnicityColorMapping = {
        perc_white: '#A72608', // Red
        perc_black: '#566C2C', // Light green
        perc_aapi: '#3A481E', // Green
        // perc_hispanic: '#EC9192', // Pink
        perc_other: '#EC9192', // Grey
        perc_two_or_more: '#000' // Grey for multiracial and two or more (or define another color)
    };

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
    }, [geojsonData,map.current]);

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
            minZoom: 10, // how far out (can see whole Boston)
            maxZoom: 16 // how close to get
        });

        map.current.once('load', fetchData);
    }, [selectedYear]);

    useEffect(() => {
        if (!map.current || !geojsonData || !csvData) return; // Ensure the map and data are loaded
        addNeighborhoodsLayer(selectedEthnicity, geojsonData, specificYearData);
    }, [selectedEthnicity, geojsonData, csvData, specificYearData]); // Re-run when ethnicity or data changes

    const handleMouseMove = (event) => {
        if (!event.features || event.features.length === 0) {
            clearHoverState();
            return;
        }

        const properties = event.features[0].properties;
        const featureId = event.features[0].id;

        // Check if the hovered feature is the same as the previous
        if (!hoveredFeature || hoveredFeature.id !== featureId) {
            setHoveredFeature(properties);
            setMousePosition({ x: event.point.x, y: event.point.y });

            // Update hover state
            const originalColor = properties.color;
            const darkenedColor = tinycolor(originalColor).darken(10).toString();
            map.current.setFeatureState(
                { source: 'neighborhoods', id: featureId },
                { hoverColor: darkenedColor }
            );

            if (hoveredFeature && hoveredFeature.id !== featureId) {
                // Reset previous hover state
                map.current.setFeatureState(
                    { source: 'neighborhoods', id: hoveredFeature.id },
                    { hoverColor: null }
                );
            }
        }
    };

    const handleMouseLeave = (event) => {
        clearHoverState();
    };

    const clearHoverState = () => {
        if (hoveredFeature) {
            map.current.setFeatureState(
                { source: 'neighborhoods', id: hoveredFeature.id },
                { hoverColor: null }
            );
            setHoveredFeature(null);
            setMousePosition({ x: 0, y: 0 });
        }
    };

    const fetchData = () => {
        fetch('/data/Boston_Neighborhoods.geojson')
            .then(response => response.json())
            .then(data => {
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

        const updateFillColor = (neighborhoodId, newColor) => {
            map.current.setPaintProperty('neighborhoods-fill', 'fill-color', ['match', ['get', 'id'], neighborhoodId, newColor, '#888888']);
        };

        geojsonData.features.forEach((feature, index) => {
            feature.id = feature.id || index;
            const neighborhoodData = specificYearData.find(d =>
                d.Neighborhood === feature.properties.blockgr2020_ctr_neighb_name);
            feature.properties.value = neighborhoodData ? parseFloat(neighborhoodData[selectedEthnicity]) : 0;
            feature.properties.color = getMonochromeColor(feature.properties.value, minValue, maxValue, baseColor);
            // const neighborhoodId = feature.id;
            // const newColor = feature.properties.color;
            // // // Setting feature state for dynamic styling
            // // map.current.setFeatureState(
            // //     { source: 'neighborhoods', id: neighborhoodId },
            // //     { color: newColor }
            // // );
        });

        if (!map.current.getSource('neighborhoods')) {
            map.current.addSource('neighborhoods', {
                type: 'geojson',
                data: geojsonData,
                promoteId: 'id'
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
                            { source: 'neighborhoods', id: hoveredNeighborhoodId },
                            { hover: false }
                        );
                    }
                    hoveredNeighborhoodId = currentHoverId;
                    map.current.setFeatureState(
                        { source: 'neighborhoods', id: hoveredNeighborhoodId },
                        { hover: true }
                    );
                    updateInformationDisplay(e.features[0].properties);
                }
            }
        });

        map.current.on('mouseleave', 'neighborhoods-fill', () => {
            if (hoveredNeighborhoodId !== null) {
                map.current.setFeatureState(
                    { source: 'neighborhoods', id: hoveredNeighborhoodId },
                    { hover: false }
                );
                hoveredNeighborhoodId = null;
                clearInformationDisplay();
            }
        });

        // if (!map.current.getLayer('neighborhoods-fill')) {
        //     map.current.addLayer({
        //         id: 'neighborhoods-fill',
        //         type: 'fill',
        //         source: 'neighborhoods',
        //         paint: {
        //             'fill-color': ['get', 'color'], // Use color property from features
        //             'fill-opacity': 0.75
        //         }
        //         // paint: {
        //         //     'fill-color': [
        //         //         'case',
        //         //         ['boolean', ['feature-state', 'hoverColor'], false],
        //         //         ['feature-state', 'hoverColor'],
        //         //         ['get', 'color']
        //         //     ],
        //         //     'fill-opacity': 0.75
        //         // }
        //     });
        // }
        // if (!map.current.getLayer('neighborhoods-outline')) {
        //     map.current.addLayer({
        //         id: 'neighborhoods-outline',
        //         type: 'line',
        //         source: 'neighborhoods',
        //         paint: {
        //             'line-color': '#aaa', // Black outline
        //             'line-width': 3 // Width of the line
        //         }
        //     });
        // }
        // if (!map.current.getLayer('neighborhoods-labels')) {
        //     map.current.addLayer({
        //         id: 'neighborhoods-labels',
        //         type: 'symbol',
        //         source: 'neighborhoods',
        //         layout: {
        //             'text-field': ['get', 'blockgr2020_ctr_neighb_name'], // Make sure this matches your GeoJSON properties
        //             'text-variable-anchor': ['center'],
        //             'text-radial-offset': 0,
        //             'text-justify': 'center',
        //             'text-size': 15
        //         },
        //         paint: {
        //             'text-color': '#ffffff', // White text
        //             'text-halo-color': '#000000', // Black outline
        //             'text-halo-width': 2, // Width of the outline, adjust as necessary
        //             'text-halo-blur': 1 // Optional blur for the outline
        //         }
        //     });
        // }

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
                    'fill-color': ['get', 'color'],
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
    function updateInformationDisplay(properties) {
        // Update the display with information from the hovered neighborhood
        console.log('Displaying info for:', properties);
    }

    function clearInformationDisplay() {
        // Clear the information display
        console.log('Clearing display info');
        setHoveredFeature(null);
    }

    return (
        <div className="map-wrap">
            <select className="map-overlay" value={selectedEthnicity}
                    onChange={e => setSelectedEthnicity(e.target.value)}>
                <option value="perc_aapi">Percentage AAPI</option>
                <option value="perc_black">Percentage Black</option>
                <option value="perc_white">Percentage White</option>
                <option value="perc_other">Percentage Other</option>
                <option value="perc_two_or_more">Percentage Two or More</option>
            </select>
            <div ref={mapContainer} className="map"/>
            <GradientBar color={ethnicityColorMapping[selectedEthnicity] || '#FFFFFF'} maxVal={maxEthnicityValue}/>
            <TimeSlider
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                ethnicityColorMapping={ethnicityColorMapping}
                selectedEthnicity={selectedEthnicity}/>
            <HoverBox
                hoveredFeature={hoveredFeature}
                mousePosition={mousePosition}
                specificYearData={specificYearData}
                selectedEthnicity={selectedEthnicity}
            />
        </div>

    );
}

