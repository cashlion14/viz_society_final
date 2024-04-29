import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { csvParse } from 'd3-dsv';
import { scaleSequential } from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {interpolateReds, interpolateYlGn} from 'd3-scale-chromatic';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [zoom] = useState(11);
    const [selectedEthnicity, setSelectedEthnicity] = useState('perc_aapi');
    const boston = {lng: -71.0589, lat: 42.3601};
    maptilersdk.config.apiKey = '37cqcVAKPgwCo3fuGPSy';
    const ethnicityColorMapping = {
        perc_white: '#A72608', // Red
        perc_black: '#566C2C', // Light green
        perc_aapi: '#3A481E', // Green
        // perc_hispanic: '#EC9192', // Pink
        perc_other: '#EC9192', // Grey
        perc_two_or_more: '#D9D9D9' // Grey for multiracial and two or more (or define another color)
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
    }, []);

    useEffect(() => {
        if (!map.current || !geojsonData || !csvData) return; // Ensure the map and data are loaded
        addNeighborhoodsLayer(selectedEthnicity, geojsonData, csvData);
    }, [selectedEthnicity,  geojsonData, csvData]); // Re-run when ethnicity or data changes

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
                        const year2020Data = parsedCsvData.filter(d => d.Year === '2020');
                        console.log("CSV 2020 Data:", year2020Data);
                        setCsvData(year2020Data);
                    });
            });
    }
    const getMonochromeColor = (value, minValue, maxValue,color)=> {
        // Create a scale that returns a color based on the input value
        const scale = scaleSequential(interpolateRgb(`#ffffff`, color)).domain([minValue, maxValue]);
        return scale(value);
    };
    const addNeighborhoodsLayer = (selectedEthnicity, geojsonData, year2020Data)=>
    {
        // Find min and max values for the selected ethnicity for proper scaling
        const values = csvData.map(d => parseFloat(d[selectedEthnicity]));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

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

        geojsonData.features.forEach(feature => {
            const neighborhoodData = csvData.find(d =>
                d.Neighborhood === feature.properties.blockgr2020_ctr_neighb_name);
            feature.properties.value = neighborhoodData ? parseFloat(neighborhoodData[selectedEthnicity]) : 0;
            feature.properties.color = getMonochromeColor(feature.properties.value, minValue, maxValue, baseColor);

        });

        // Add the source for neighborhoods
        map.current.addSource('neighborhoods', {
            type: 'geojson',
            data: geojsonData
        });

        // Add layer for coloring
        map.current.addLayer({
            id: 'neighborhoods-fill',
            type: 'fill',
            source: 'neighborhoods',
            paint: {
                'fill-color': ['get', 'color'], // Use color property from features
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
                { source: 'neighborhoods', id: feature.id },
                { color: color }
            );
        });
    }

    return (
        <div className="map-wrap">
            <select className="map-overlay" value={selectedEthnicity} onChange={e => setSelectedEthnicity(e.target.value)}>
                <option value="perc_aapi">Percentage AAPI</option>
                <option value="perc_black">Percentage Black</option>
                <option value="perc_white">Percentage White</option>
                <option value="perc_other">Percentage Other</option>
                <option value="perc_two_or_more">Percentage Two or More</option>
            </select>
            <div ref={mapContainer} className="map"/>
        </div>
    );
}

