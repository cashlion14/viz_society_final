import './utilities.css'
import React from "react";
import image3 from './image3.png';
import image4 from './image4.png';
import image5 from './image5.png';

const Takeaways = () => {
    return (
        <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center'}}>
            <div style={{ display: 'flex', flexDirection: "column", maxWidth: '400px'}}>
                <div>
                    <h1 style={{ marginBottom: '40px'}}>Why does any of this matter?</h1>
                    <p>In this project, we primarily demonstrated that corporate ownership rates and minority population rates are negatively correlated. Now, we need to push for further change to explore causal links. </p>
                    <p>One way to do this is by reaching out to your local legislator, and asking them what they think about the issue. Find out who to contact <a href="https://malegislature.gov/Search/FindMyLegislator">here</a>.</p>
                </div>
                <div>
                    <img src={image4} alt="" style={{ width: '400px' }}></img>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: "column"}}>
                <div>
                    <img src={image3} alt="" style={{ width: '550px' }}></img>
                </div>
                <div>
                    <img src={image5} alt="" style={{ width: '550px' }}></img>
                </div>
            </div>
        </div>
      );
    };

export default Takeaways