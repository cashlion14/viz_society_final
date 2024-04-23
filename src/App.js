import React from "react";
import MainPage from "./MainPage";
import Scrollytelling from "./Scrollytelling";

import "./utilities.css";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Scrollytelling />
      <MainPage />
    </div>
  );
}

export default App;
