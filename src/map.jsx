import React, {useEffect, useRef, useState} from 'react';
import * as maptilersdk from '@maptiler/sdk';
import {csvParse} from 'd3-dsv';
import {scaleSequential} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {GradientBar} from './GradientBar';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import tinycolor from 'tinycolor2';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [csvData, setCsvData] = useState(null);
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
        map.current.on('mouseenter', 'neighborhoods-fill', handleMouseEnter);
        // Add event listener for mouseleave to each neighborhood feature
        map.current.on('mouseleave', 'neighborhoods-fill', handleMouseLeave);

        return () => {
            // Remove event listeners when component unmounts
            map.current.off('mouseenter', 'neighborhoods-fill', handleMouseEnter);
            map.current.off('mouseleave', 'neighborhoods-fill', handleMouseLeave);
        };
    }, [geojsonData]);

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const handleMouseEnter = (event) => {
        console.log("handle mouse enter");
        if (!event.features || event.features.length === 0) {
            console.error('No features available in the event');
            return;
        }

        const properties = event.features[0].properties;
        const featureId = event.features[0].id;
        setHoveredFeature(properties);
        setMousePosition({ x: event.point.x, y: event.point.y });

        // Darken the color of the hovered feature
        const originalColor = properties.color; // This assumes that color is stored in properties
        const darkenedColor = tinycolor(originalColor).darken(10).toString(); // Adjust the darken value as needed
        console.log("Setting hover color for feature:", featureId, darkenedColor);

        map.current.setFeatureState(
            { source: 'neighborhoods', id: event.features[0].id },
            { hoverColor: darkenedColor }
        );
    };

    const handleMouseLeave = (event) => {
        console.log("handle mouse leave");
        // Only reset hover state if there's a currently hovered feature
        if (hoveredFeature && hoveredFeature.id) {
            map.current.setFeatureState(
                { source: 'neighborhoods', id: hoveredFeature.id },
                { hoverColor: null }
            );
        }

        // Clear the hovered feature state
        setHoveredFeature(null);
    };

// Render a hover box if a feature is hovered
    const renderHoverBox = () => {
        console.log("in render hoverbox");
        if (!hoveredFeature) return null;

        // Extract information from CSV based on the hovered feature data
        const neighborhoodData = csvData.find(d => d.Neighborhood === hoveredFeature.blockgr2020_ctr_neighb_name);
        const hoveredEthnicityValue = neighborhoodData ? neighborhoodData[selectedEthnicity] : 'Data not available';
        console.log("nd", neighborhoodData);
        console.log("sE", selectedEthnicity, "HD", hoveredEthnicityValue);
        const style = {
            left: `${mousePosition.x + 10}px`, // 10px to the right of the cursor
            top: `${mousePosition.y + 10}px`  // 10px below the cursor
        };
        return (
            <div className="hover-box" style={style}>
                <h3>{hoveredFeature.blockgr2020_ctr_neighb_name}</h3>
                {hoveredEthnicityValue && <p>{selectedEthnicity}: {hoveredEthnicityValue}</p>}
                {neighborhoodData && neighborhoodData.corp_own_rate && <p>Corporate Ownership Rate: {neighborhoodData.corp_own_rate}</p>}
                {neighborhoodData && neighborhoodData.own_occ_rate && <p>Owner Occupation Rate: {neighborhoodData.own_occ_rate}</p>}
                <p>Reach out to your city government to learn more about your housing laws: <a href="link to city government">link</a>!</p>
            </div>
        );
    };

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
        addNeighborhoodsLayer(selectedEthnicity, geojsonData, csvData);
    }, [selectedEthnicity, geojsonData, csvData]); // Re-run when ethnicity or data changes

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
                        console.log("Geo Data:", geojsonData);
                        // const year2020Data = parsedCsvData.filter(d => d.Year === '2020');
                        const filteredData = parsedCsvData.filter(d => d.Year === String(selectedYear));
                        console.log("CSV 2020 Data:", filteredData);
                        setCsvData(filteredData);
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
        const values = csvData.map(d => parseFloat(d[selectedEthnicity]));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        setMaxEthnicityValue(maxValue);

        if (map.current.getLayer('neighborhoods-fill')) {
            map.current.removeLayer('neighborhoods-fill');
        }
        if (map.current.getLayer('neighborhoods-outline')) {
            map.current.removeLayer('neighborhoods-outline');
        }
        if (map.current.getLayer('neighborhoods-labels')) {
            map.current.removeLayer('neighborhoods-labels');
        }
        if (map.current.getSource('neighborhoods')) {
            map.current.removeSource('neighborhoods');
        }

        const baseColor = ethnicityColorMapping[selectedEthnicity] || '#FFFFFF';

        geojsonData.features.forEach((feature, index) => {
            feature.id = feature.id || index;
            const neighborhoodData = csvData.find(d =>
                d.Neighborhood === feature.properties.blockgr2020_ctr_neighb_name);
            feature.properties.value = neighborhoodData ? parseFloat(neighborhoodData[selectedEthnicity]) : 0;
            feature.properties.color = getMonochromeColor(feature.properties.value, minValue, maxValue, baseColor);

        });

        // Add the source for neighborhoods
        map.current.addSource('neighborhoods', {
            type: 'geojson',
            data: geojsonData,
            promoteId: 'id'
        });

        // Add layer for coloring
        map.current.addLayer({
            id: 'neighborhoods-fill',
            type: 'fill',
            source: 'neighborhoods',
            // paint: {
            //     'fill-color': ['get', 'color'], // Use color property from features
            //     'fill-opacity': 0.75
            // }
            paint: {
                'fill-color': [
                    'case',
                    ['boolean', ['feature-state', 'hoverColor'], false],
                    ['feature-state', 'hoverColor'],
                    ['get', 'color']
                ],
                'fill-opacity': 0.75
            }
        });
        map.current.addLayer({
            id: 'neighborhoods-outline',
            type: 'line',
            source: 'neighborhoods',
            paint: {
                'line-color': '#aaa', // Black outline
                'line-width': 3 // Width of the line
            }
        });

        map.current.addLayer({
            id: 'neighborhoods-labels',
            type: 'symbol',
            source: 'neighborhoods',
            layout: {
                'text-field': ['get', 'blockgr2020_ctr_neighb_name'], // Make sure this matches your GeoJSON properties
                'text-variable-anchor': ['center'],
                'text-radial-offset': 0,
                'text-justify': 'center',
                'text-size': 15
            },
            paint: {
                'text-color': '#ffffff', // White text
                'text-halo-color': '#000000', // Black outline
                'text-halo-width': 2, // Width of the outline, adjust as necessary
                'text-halo-blur': 1 // Optional blur for the outline
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
            <div className="year-slider">
                <input type="range"
                       min="2000"
                       max="2050"
                       value={selectedYear}
                       onChange={e => setSelectedYear(e.target.value)}
                       className="slider" />
                <p>Selected Year: {selectedYear}</p>
            </div>
            {hoveredFeature ? renderHoverBox() : null}

        </div>

    );
}

