import React, { useState, useEffect } from "react";
import MainPage from "./MainPage";
import {
  Page1,
  Page2,
  Page3,
  Page4,
  Page5,
  Page6,
  Page7,
  Page8,
} from "./Scrollytelling";
import "./utilities.css";
import "./App.css";

function App() {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const handleScroll = (event) => {

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 0.5;

      if (scrollPosition < windowHeight - scrollThreshold) {
        setActiveIndex(1);
      } else if (scrollPosition < 2 * windowHeight - scrollThreshold) {
        setActiveIndex(2);
      } else if (scrollPosition < 3 * windowHeight - scrollThreshold) {
        setActiveIndex(3);
      } else if (scrollPosition < 4 * windowHeight - scrollThreshold) {
        setActiveIndex(4);
      } else if (scrollPosition < 5 * windowHeight - scrollThreshold) {
        setActiveIndex(5);
      } else if (scrollPosition < 6 * windowHeight - scrollThreshold) {
        setActiveIndex(6);
      } else if (scrollPosition < 7 * windowHeight - scrollThreshold) {
        setActiveIndex(7);
      } else if (scrollPosition < 8 * windowHeight - scrollThreshold) {
        setActiveIndex(8);
      } else {
        setActiveIndex(9);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex]);

  return (
    <div className="app-container">
      <div className={activeIndex === 1 ? "component active" : "component"}>
        <Component1 />
      </div>
      <div className={activeIndex === 2 ? "component active" : "component"}>
        <Component2 />
      </div>
      <div className={activeIndex === 3 ? "component active" : "component"}>
        <Component3 />
      </div>
      <div className={activeIndex === 4 ? "component active" : "component"}>
        <Component4 />
      </div>
      <div className={activeIndex === 5 ? "component active" : "component"}>
        <Component5 />
      </div>
      <div className={activeIndex === 6 ? "component active" : "component"}>
        <Component6 />
      </div>
      <div className={activeIndex === 7 ? "component active" : "component"}>
        <Component7 />
      </div>
      <div className={activeIndex === 8 ? "component active" : "component"}>
        <Component8 />
      </div>
      <div className={activeIndex === 9 ? "component active" : "component"}>
          <Component9 />
      </div>
    </div>
  );
}

const Component1 = () => {
  return (
    <div>
      <Page1 />
    </div>
  );
};

const Component2 = () => {
  return (
    <div>
      <Page2 />
    </div>
  );
};

const Component3 = () => {
  return (
    <div>
      <Page3 />
    </div>
  );
};

const Component4 = () => {
  return (
    <div>
      <Page4 />
    </div>
  );
};

const Component5 = () => {
  return (
    <div>
      <Page5 />
    </div>
  );
};

const Component6 = () => {
  return (
    <div>
      <Page6 />
    </div>
  );
};

const Component7 = () => {
  return (
    <div>
      <Page7 />
    </div>
  );
};

const Component8 = () => {
  return (
    <div>
      <Page8 />
    </div>
  );
};

const Component9 = () => {
  return (
    <div>
      <MainPage />
    </div>
  );
};

export default App;
