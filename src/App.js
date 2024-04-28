import React, {useEffect} from "react";
import MainPage from "./MainPage";
import Scrollytelling from "./Scrollytelling";
import Map from './map.jsx';
import "./utilities.css";
import "./App.css";
import {initializeMap} from "./swipeMap";

function App() {
    // useEffect(() => {
    //     initializeMap();
    // }, []);
    return (
        <div className="app-container">
            <Map/>
            {/*<div>*/}
            {/*    <input id="swipe" type="range" min="0" max="100" defaultValue="50"/>*/}
            {/*    <div id="map" style={{width: '800px', height: '600px'}}></div>*/}
            {/*</div>*/}
            <Scrollytelling/>
            <MainPage/>

        </div>
    );
}

export default App;
