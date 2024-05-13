import './utilities.css'
import React from "react";

const About = () => {
    return (
        <div style={{ display: 'flex', flexDirection: "column"}}>
            <div style={{ display: 'flex', flexDirection: "row"}}>
                <div style={{maxWidth: '400px', marginRight: '100px' }}>
                    <h1 style={{ marginBottom: '20px'}}>About Our Project</h1>
                    <p>We are students from MIT working on a data visualization project for 6.C85, Data Visualization and Society. </p>
                    <p>This project, which we have undertaken over the course of the Spring semester, focuses on the correlation between corporate ownership and decreased racial diversity in Boston.</p>
                    <p>Through data visualization techniques, we analyze and present data to highlight patterns and disparities in housing ownership and racial diversity.</p>
                </div>

                <div style={{maxWidth: '400px', marginLeft: '100px'}}>
                    <h1 style={{ marginBottom: '20px' }}>Acknowledgements</h1>
                    <p>This project was developed with guidance and feedback from the <a href="https://www.mapc.org/">Metropolitan Area Planning Commission (MAPC)</a>. Without their guidance and data, this project would not have been possible. For our data, we used information from ACS 2020-2023 and Census 2020. </p>
                    <p>Furthermore, we would like to sincerely extend our appreciation to the entire 6.C85 course staff. They have been incredibly helpful throughout this entire process, and this journey would not have been possible without their guidance every step of the way. Thank you for all of your help and support!</p>
                </div>
            </div>
            <div style={{marginTop: '20px'}}>
                <p>Sincerely, <br/> Diptasri Gupta, Ariel Fuchs, and Jake Jones</p>
            </div>
        </div>
      );
    };

export default About