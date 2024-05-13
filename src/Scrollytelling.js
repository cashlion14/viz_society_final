import React from "react";
import "./utilities.css";
import corporateImg from './corporateImg.png';
import correlations from './correlations.png';
import predictions from './predictions.png';

const EthnicityLabels = () => {
  const circles = [];

  circles.push(<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div className={`circle light-green`}></div><p style={{ margin: "0" }}>Black</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div className={`circle pink`}></div><p style={{ margin: "0" }}>Hispanic</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div className={`circle green`}></div><p style={{ margin: "0" }}>AAPI</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div className={`circle red`}></div><p style={{ margin: "0" }}>White</p></div>);
  circles.push(<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div className={`circle grey`}></div><p style={{ margin: "0" }}>Multiracial / Other</p></div>);

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
          <p style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px' }}>For every 100 people in Boston, 22 live in corporate owned housing</p>
        </div>
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
        <EthnicityLabels className="ethnicity-labels"/>
        <div className="circles-box">
          {rows}
          <p style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px' }}>Out of 100 Bostonians, 46 are of traditionally underrepresented minority groups</p>
        </div>
        <div style={{paddingRight: '173.88px'}}></div>
      </div>
    </div>
  );
};

export const Page4 = () => {
  return (
    <div className="main">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <img src={corporateImg} alt="Corporate Ownership Rising" style={{ width: '45%', height: 'auto' }} />
        <img src={correlations} alt="Correlations between Corporate Ownership and Race" style={{ width: '45%', height: 'auto' }} />
      </div>
      <p style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px' }}>
        Corporate ownership has been steadily rising since 2005. There is also a strong correlation between certain demographics and corporate ownership rates. We seek to answer the question:
      </p>
      <h1 style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px', fontSize: '30px'}}>
        <b>If trends in corporate ownership rates (CORs) continue, what would the demographics of Boston look like?</b>
      </h1>
    </div>
  );
};

export const Page5 = () => {
  return (
    <div className="main">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <img src={predictions} alt="Future Predictions of Corporate Ownership Rates" style={{ width: '45%', height: 'auto' }} />
      </div>
      <p style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px' }}>
        We fit a logistic growth model to the preexisting data to forecast CORs in the future. We chose a logistic model as it captures the following features:
      </p>
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
        <li>S-Shaped Curve: Ideal for processes that begin slowly, accelerate, and then plateau, mirroring real-world adoption scenarios.</li>
        <li>Capacity Constraint: Includes a maximum limit based on environmental and resource constraints, useful for modeling growth in constrained environments.</li>
        </ul>
      </div>
    </div>
  );
};


export const Page6 = () => {
  return (
    <div className="main" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      <div style={{ flex: '1', overflowWrap: 'break-word', textAlign: 'center', marginTop: '18px' }}>
        <h1>
        We used projections of CORs to predict what Boston may look like in the future.
        </h1>
        <p style={{ color: '#e6a3a4' }}>
          Note: These predictions are based on a limited number of factors and are speculative.
        </p>
        <p style={{ color: '#EC9192' }}>
          We present three scenarios: optimistic (slower growth in corporate ownership rates), pessimistic (faster growth), and realistic projections to capture the future's uncertainty.
        </p>
        <p style={{ color: '#e07072' }}>
          We use historical data linking demographics and CORs. While this relationship may not be causal, this graphic is a thought experiment that explores what Boston might look like if it were.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Step into the future</h1>
        <span style={{ fontSize: '24px' }}>&#x2193;</span>
      </div>

    </div>
  );
};

export const Page7 = () => {
  return (
    <div className="main">
      <h1> Boston 2050 </h1>
    </div>
  );
};

export const Page8 = () => {

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
      <div className='circles-container'>
        <div style={{paddingLeft: '65.17px'}}></div>
        <div className="circles-box" >
          {rows}
          <p style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px' }}>If trends in corporate ownership continue, 77 out of every 100 people will live in corporate housing by 2050</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1>↑<br />55%</h1>
        </div>
      </div>
    </div>
  );
};

export const Page9 = () => {
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
        <EthnicityLabels className="ethnicity-labels"/>
        <div className="circles-box">
          {rows}
          <p style={{ overflowWrap: 'break-word', textAlign: 'right', marginTop: '18px' }}>At the same time, just 33 of every 100 Bostonians would be of underrepresented minority groups</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '109.28px' }}>
          <h1>↓ <br /> 13%</h1>
        </div>
      </div>
    </div>
  );
};

export const Page10 = () => {
  return (
    <div className="main">
      <h1> Boston 2050:</h1>
      <h1> More Corportate Owners, Less Diversity</h1>
    </div>
  );
};

export const Page11 = () => {
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
