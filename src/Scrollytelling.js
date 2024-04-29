import React from "react";
import "./utilities.css";

const EthnicityLabels = () => {
  const circles = [];

  circles.push(<div style={{ display: 'flex', flexDirection: 'row' }}><div className={`circle light-green`}></div><p>Black</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row' }}><div className={`circle pink`}></div><p>Hispanic</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row' }}><div className={`circle green`}></div><p>AAPI</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row' }}><div className={`circle red`}></div><p>White</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row' }}><div className={`circle grey`}></div><p>Multiracial / Other</p></div>);

  return <div className="circles-column">{circles}</div>;
};


export const Page1 = () => {
  return (
    <div className="main">
      <h1> Boston 2020</h1>
    </div>
  );
};

export const Page2 = () => {

  const rows = [];
  const rowCount = 10; // Number of rows
  const colCount = 10; // Number of columns
  const redCirclesCount = 22; // Number of red circles

  // Generate rows
  for (let i = 0; i < rowCount; i++) {
    const circles = [];
    // Generate circles in each row
    for (let j = 0; j < colCount; j++) {
      const circleIndex = i * colCount + j;
      const isRed = circleIndex < redCirclesCount;
      circles.push(<div key={circleIndex} className={`circle ${isRed ? 'red' : ''}`}></div>);
    }
    // Add row to rows array
    rows.push(
      <div key={`row-${i}`} className="row">
        {circles}
      </div>
    );
  }
  return (
    <div className='main'>
      <h1> Boston 2020</h1>
        <div className="circles-box">
          {rows}
        </div>
      <p>For every 100 people in Boston, 22 live in corporate owned housing</p>
    </div>
  );
};

export const Page3 = () => {
  const rows = [];
  const rowCount = 10; // Number of rows
  const colCount = 10; // Number of columns

  for (let i = 0; i < rowCount; i++) {
    const circles = [];
    for (let j = 0; j < colCount; j++) {
      const circleIndex = i * colCount + j;
      const isGrey = circleIndex >= 0 && circleIndex <= 6;
      const isLightGreen = circleIndex >= 7 && circleIndex <= 25;
      const isPink = circleIndex >= 26 && circleIndex <= 45;
      const isGreen = circleIndex >= 46 && circleIndex <= 56;
      const isRed = circleIndex >= 57 && circleIndex <= 100;
      circles.push(<div key={circleIndex} className={`circle ${isRed ? 'red' : ''} ${isGrey ? 'grey' : ''} ${isGreen ? 'green' : ''} ${isLightGreen ? 'light-green' : ''} ${isPink ? 'pink' : ''}`}></div>);
    }

    rows.push(
      <div key={`row-${i}`} className="row">
        {circles}
      </div>
    );
  }
  return (
    <div className='main'>
      <h1> Boston 2020</h1>
      <div className='circles-container'>
        <EthnicityLabels />
        <div className="circles-box">
          {rows}
        </div>
      </div>
      <p>
      Out of 100 Bostonians, 46 are of traditionally underrepresented minority groups
      </p>
    </div>
  );
};

export const Page4 = () => {
  return (
    <div className="main">
      <h1> Boston 2050 </h1>
    </div>
  );
};

export const Page5 = () => {

  const rows = [];
  const rowCount = 10; // Number of rows
  const colCount = 10; // Number of columns
  const redCirclesCount = 77; // Number of red circles

  // Generate rows
  for (let i = 0; i < rowCount; i++) {
    const circles = [];
    // Generate circles in each row
    for (let j = 0; j < colCount; j++) {
      const circleIndex = i * colCount + j;
      const isRed = circleIndex < redCirclesCount;
      circles.push(<div key={circleIndex} className={`circle ${isRed ? 'red' : ''}`}></div>);
    }
    // Add row to rows array
    rows.push(
      <div key={`row-${i}`} className="row">
        {circles}
      </div>
    );
  }
  return (
    <div className='main'>
      <h1> Boston 2050</h1>
      <div className="circles-box">
        {rows}
      </div>
      <p>
      If trends in corporate ownership continue, 77 out of every 100 people will live in corporate housing by 2050
      </p>
    </div>
  );
};

export const Page6 = () => {
  const rows = [];
  const rowCount = 10; // Number of rows
  const colCount = 10; // Number of columns

  for (let i = 0; i < rowCount; i++) {
    const circles = [];
    for (let j = 0; j < colCount; j++) {
      const circleIndex = i * colCount + j;
      const isGrey = circleIndex >= 0 && circleIndex <= 5;
      const isLightGreen = circleIndex >= 6 && circleIndex <= 19;
      const isPink = circleIndex >= 20 && circleIndex <= 32;
      const isGreen = circleIndex >= 33 && circleIndex <= 44;
      const isRed = circleIndex >= 45 && circleIndex <= 100;
      circles.push(<div key={circleIndex} className={`circle ${isRed ? 'red' : ''} ${isGrey ? 'grey' : ''} ${isGreen ? 'green' : ''} ${isLightGreen ? 'light-green' : ''} ${isPink ? 'pink' : ''}`}></div>);
    }

    rows.push(
      <div key={`row-${i}`} className="row">
        {circles}
      </div>
    );
  }
  return (
    <div className='main'>
      <h1> Boston 2050</h1>
      <div className='circles-container'>
        <EthnicityLabels />
        <div className="circles-box">
          {rows}
        </div>
      </div>
      <p>
      At the same time, just 33 of every 100 Bostonians would be of underrepresented minority groups
      </p>
    </div>
  );
};

export const Page7 = () => {
  return (
    <div className="main">
      <h1> Boston 2050:</h1>
      <h1> More Corportate Owners, Less Diversity</h1>
    </div>
  );
};

export const Page8 = () => {
  return (
    <div className="main" style={{ color: "#EC9192", fontSize: "20px" }}>
      <p>
        Explore the growing landscape of Boston's corporate ownership and its
        profound impact on our city.{" "}
      </p>
      <p>
        Discover how concentrated ownership is reshaping neighborhoods, reducing
        diversity, and skewing towards wealthier, older residents.{" "}
      </p>
      <p>
        Join us as we delve into the implications and seek solutions for a more
        equitable and vibrant Boston.
      </p>
    </div>
  );
};
