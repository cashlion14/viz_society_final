import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { csvParse } from 'd3-dsv';
import { scaleSequential } from 'd3-scale';
import {interpolateReds, interpolateYlGn} from 'd3-scale-chromatic';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [data, setData] = useState(null);
    const [zoom] = useState(11);
    const [selectedEthnicity, setSelectedEthnicity] = useState('perc_white');
    const boston = {lng: -71.0589, lat: 42.3601};
    maptilersdk.config.apiKey = '37cqcVAKPgwCo3fuGPSy';

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS.DARK,
            center: [boston.lng, boston.lat],
            zoom: zoom,
            minZoom:10, //how far out (can see whole boston)
            maxZoom:16 //how small to get
        });

        // Add a 'load' event listener
        map.current.once('load', () => {
            fetch('/data/Boston_Neighborhoods.geojson')
                .then(response => response.json())
                .then(geojsonData => {
                    fetch('/data/all_data_2004_to_2050.csv')
                        .then(response => response.text())
                        .then(csvText => {
                            const csvData = csvParse(csvText);
                            console.log("CSV Data:", csvData);
                            console.log("Geo Data:", geojsonData);
                            const year2020Data = csvData.filter(d => d.Year === '2020');
                            console.log("CSV 2020 Data:", year2020Data);
                            setData(year2020Data);
                            addNeighborhoodsLayer(selectedEthnicity, geojsonData, year2020Data);
                        });
                });
        });


        function getMonochromeColor(value, minValue, maxValue) {
            // Create a scale that returns a color based on the input value
            const scale = scaleSequential(interpolateReds).domain([minValue, maxValue]);
            return scale(value);
        }

        // Function to add neighborhoods layer
        function addNeighborhoodsLayer(selectedEthnicity, geojsonData, year2020Data) {
            // Find min and max values for the selected ethnicity for proper scaling
            const values = year2020Data.map(d => parseFloat(d[selectedEthnicity]));
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            geojsonData.features.forEach(feature => {
                console.log("FEATURE:", feature);
                const neighborhoodData = year2020Data.find(d =>
                    d.Neighborhood === feature.properties.blockgr2020_ctr_neighb_name);
                feature.properties.value = neighborhoodData ? parseFloat(neighborhoodData[selectedEthnicity]) : 0;
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
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'value'],
                        minValue, '#ffcccc',  // Light red
                        maxValue, '#990000'   // Dark red
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
                    { source: 'neighborhoods', id: feature.id },
                    { color: color }
                );
            });
        }
    }, [boston.lng, boston.lat, zoom, selectedEthnicity]);
    return (
        <div className="map-wrap">

            <div ref={mapContainer} className="map"/>
        </div>
    );
}

